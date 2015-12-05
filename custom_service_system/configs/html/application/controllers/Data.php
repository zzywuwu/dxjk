<?php
defined('BASEPATH') OR exit('No direct script access allowed');

include_once "WXBizMsgCrypt.php";

class Data extends CI_Controller {

	/**
	 * Index Page for this controller.
	 *
	 * Maps to the following URL
	 * 		http://example.com/index.php/welcome
	 *	- or -
	 * 		http://example.com/index.php/welcome/index
	 *	- or -
	 * Since this controller is set as the default controller in
	 * config/routes.php, it's displayed at http://example.com/
	 *
	 * So any other public methods not prefixed with an underscore will
	 * map to /index.php/welcome/<method_name>
	 * @see http://codeigniter.com/user_guide/general/urls.html
	 */

	private  $message_id = 0;
    private  $agentid = 4;
    private  $encodingAesKey = "wq4NhTJBnfjTOV6SvJzPdzbEd5p26XESUiRE9jU3k8R";
    private  $token = "PxxEDeWgUWXMneI61c";
    private  $corpId = "wx755e6479b3b52da5";   

	/*
	//用于绑定url
    public function wxbindurl()
    {
        $encodingAesKey = "wq4NhTJBnfjTOV6SvJzPdzbEd5p26XESUiRE9jU3k8R";
        $token = "PxxEDeWgUWXMneI61c";
        $corpId = "wx755e6479b3b52da5";
       
        $sEchoStr = "";
        $wxcpt = new WXBizMsgCrypt($token, $encodingAesKey, $corpId);
        $errCode = $wxcpt->VerifyURL($this->input->get('msg_signature'), $this->input->get('timestamp'), $this->input->get('nonce'), $this->input->get('echostr'), $sEchoStr);
        if ($errCode == 0) {
            echo $sEchoStr;
        } else {
            print("ERR: " . $errCode . "\n\n");
        }
    }*/

    public function wx()
    {
        $wxcpt = new WXBizMsgCrypt($this->token, $this->encodingAesKey, $this->corpId);
		$sReqData = file_get_contents("php://input"); 
		$sReqMsgSig = $this->input->get('msg_signature');
		$sReqTimeStamp = $this->input->get('timestamp');      
		$sReqNonce = $this->input->get('nonce');      
		$sMsg = "";
		$errCode = $wxcpt->DecryptMsg($sReqMsgSig, $sReqTimeStamp, $sReqNonce, $sReqData, $sMsg);
		// log_message('error',$errCode);
		if ($errCode == 0) {
			$xml = new DOMDocument();
			$xml->loadXML($sMsg);
			$event = $xml->getElementsByTagName('Event');
			if ($event->length==0) {
				// log_message('error',"null");
				$str = $xml->getElementsByTagName('Content')->item(0)->nodeValue;
				$this->stringhandle($str,$xml,$wxcpt);
			}
			else {
				$str = $event->item(0)->nodeValue;
				$this->eventhandle($str,$xml,$wxcpt);
			}
		} 
    }

    private function stringhandle($str,$xml,$wxcpt)
    {
	
        $userid = $xml->getElementsByTagName('FromUserName')->item(0)->nodeValue;
        $data = array(
			'script' => 'wx_serach_customer',
			'key'    => $str
		);
        $this->session->set_userdata('now_time', time());
        $code = $this->web_to_lua($data);
        $info = $this->lua_to_web($code);
    	$data_array = json_decode($info, true);
    	log_message('error',$data_array['error']);
        $info = "";
    	foreach($data_array['user_info'] as $key=>$val) {
    		log_message('error',$val);
            $info = $info.$val."\n";
    	}	
        $this->sendmessage($info,$userid,$wxcpt);
    }

    private function eventhandle($event_str,$xml,$wxcpt)
    {
    	switch($event_str)
    	{
    		case "enter_agent":
				$userid = $xml->getElementsByTagName('FromUserName')->item(0)->nodeValue;
				$info = "1：输入手机号或姓名可以查询到客户的详细资料。\n\n2：输入名字中的任意一个字进行模糊查询,例如输入'君',即可查询出所有名字里含'君'字的客户。";
				$this->sendmessage($info,$userid,$wxcpt);
				break;
			default:
				log_message('error',$event_str);
				break;
    	}
    }

    private function sendmessage($info,$userid,$wxcpt)
    {
    	$this->message_id++;
    	$curr_time = time();
		$sRespData = "<xml><ToUserName><![CDATA[".$userid."]]></ToUserName><FromUserName><![CDATA[wx755e6479b3b52da5]]></FromUserName><CreateTime>".$curr_time."</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA[".$info."]]></Content><MsgId>".$this->message_id."</MsgId><AgentID>".$this->agentid."</AgentID></xml>";
		$sEncryptMsg = ""; 
		$errCode = $wxcpt->EncryptMsg($sRespData, $curr_time, $this->message_id, $sEncryptMsg);
		// log_message('error',$this->message_id);
		if ($errCode == 0) {
			echo $sEncryptMsg;
		} 
    }

    public function loginout()
    {
        $this->session->sess_destroy();
        echo '{"error":"成功"}';
    }

    public function lua()
	{
		$data = $this->input->post();
		$file_name = $this->upload();
		if(!empty($file_name)) {
			$this->session->set_userdata('file', $file_name);
		}

		$this->session->set_userdata('now_time', time());
		$code = $this->web_to_lua($data);
		$r_code = $this->lua_to_web($code);
		echo $r_code;
	}

    public function kfsub()
    {
        $channel = $this->input->get("name");
        if (empty($this->session->userdata('name'))){
            echo "{\"error\":\"长时间未操作,请重新登录\"}";
            exit;
        }
        session_write_close();
        $ch = curl_init();
        $url = "127.0.0.1:9080/sub/".$channel;
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_TIMEOUT, 600);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true) ; // 获取数据返回
        curl_setopt($ch, CURLOPT_BINARYTRANSFER, true) ; // 在启用 CURLOPT_RETURNTRANSFER 时候将获取数据返回
        $r = curl_exec($ch);
        curl_close($ch);
        
        echo $r;
    }
	public function captcha()
	{
		$this->load->helper('captcha');
		$word = strtoupper(substr(md5(rand()),0,4));
		$vals = array(
			'word'        => $word,
			'img_path'    => './temp/captcha/',
			'img_url'     => 'http://192.168.0.101/temp/captcha',
			'expiration'  => 60,
			'font_size'   => 16
		);
		$cap = create_captcha($vals);
		$this->session->set_userdata('cap_time', $cap['time']);
		$this->session->set_userdata('cap_word', $cap['word']);
		echo $cap['time'];
	}
	private function web_to_lua($data)
	{
	   //log_message('error',$data);
        if (empty($data))
            return;
        $CI = &get_instance();
        $json_array = array(
                'web' => $data,
                'session' => $CI->session->userdata()
            );
        $json_data = json_encode($json_array, false);
        $ch = curl_init();
        $url = "127.0.0.1:8080/";
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_TIMEOUT, 600);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true) ; // 获取数据返回
       	curl_setopt($ch, CURLOPT_BINARYTRANSFER, true) ; // 在启用 CURLOPT_RETURNTRANSFER 时候将获取数据返回
        curl_setopt($ch, CURLOPT_POSTFIELDS, $json_data);
        $r = curl_exec($ch);
        curl_close($ch);
        return $r;
	}
	private function lua_to_web($data)
	{
        $CI = &get_instance();
        $data_array = json_decode($data, true);
        if (!empty($data_array['session'])) {
            //将session中的值放入到session中
            foreach($data_array['session'] as $key=>$val) {
                $CI->session->set_userdata($key,$val);
            }
        }
        $web_json = json_encode($data_array['web'], false);
        return $web_json;
	}
    
    private function upload()
    {
        $files = array();
        //$config['upload_path']      = '/opt/nginx/html/temp/file/temp';
        //$config['allowed_types']    = 'gif|jpg|png';
        $config['allowed_types']    = '*';
        $config['max_size']     = 0;
        $config['overwrite'] = true;

        //$this->load->library('upload', $config);
        $this->load->library('upload');
        //print_r($_FILES);
        $order_id = $this->input->post('id');
            
        foreach($_FILES as $key=>$val){
            $filename = $_FILES[$key]['name'];
            $config['file_name']  = $filename;
            if (empty($order_id)) {
                $config['upload_path'] = '/opt/nginx/html/temp/file/temp';
            }else{
                $config['upload_path'] = '/opt/nginx/html/temp/file/'.$order_id;
            }

            $this->upload->initialize($config);
              
            if(!$this->upload->do_upload($key)) {
                if($this->upload->display_errors() != "<p>You did not select a file to upload.</p>") {
                    echo $this->upload->display_errors();
                    return;
                }
			} else{
                $data = array('upload_data' => $this->upload->data());
                $files[$key] = $data['upload_data']['file_name'];
        	    }	
    	}
        return $files;
    }
}

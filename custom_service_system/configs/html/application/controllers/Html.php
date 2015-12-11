<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Html extends CI_Controller {

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
	public function __construct()
	{
		parent::__construct();
		$this->load->helper(array('form', 'url'));
	}
	public function index()
	{
		$this->output->set_header('Cache-Control: private, pre-check=0, post-check=0, max-age=600');
		$this->output->set_header('Expires: ' . gmstrftime("%a, %d %b %Y %H:%M:%S GMT", time()));
    	$this->output->set_header('Last-Modified: ' . gmstrftime("%a, %d %b %Y %H:%M:%S GMT", time())); 
       	$this->output->set_header('Pragma: cache');
		$this->load->view('index.html');
	}
	public function login()
	{
		$this->output->set_header('Cache-Control: private, pre-check=0, post-check=0, max-age=600');
		$this->output->set_header('Expires: ' . gmstrftime("%a, %d %b %Y %H:%M:%S GMT", time()));
    	$this->output->set_header('Last-Modified: ' . gmstrftime("%a, %d %b %Y %H:%M:%S GMT", time())); 
       	$this->output->set_header('Pragma: cache');
		$this->load->view('login.html');
	}
	public function chpwd()
	{
		$this->load->view('chpwd.html');
	}
	public function view()
	{
		$page = $this->input->get("page", true);
		if (empty($page))
			return;
		$customer_id = $this->input->get("customer_id", true);
		$this->output->set_header('Cache-Control: private, pre-check=0, post-check=0, max-age=600');
		// log_message('error',strftime("%a, %d %b %Y %H:%M:%S +800", time()));
		$this->output->set_header('Expires: ' . gmstrftime("%a, %d %b %Y %H:%M:%S GMT", time()));
    	$this->output->set_header('Last-Modified: ' . gmstrftime("%a, %d %b %Y %H:%M:%S GMT", time())); 
       	$this->output->set_header('Pragma: cache');
		if (empty($customer_id)) {
			$this->load->view($page);
		}
		else {
			$data['customer_id'] = $customer_id;			
			$this->load->view($page,$data);
		}
	}
}

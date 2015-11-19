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
		$this->load->view('index.html');
	}
	public function login()
	{
		$this->load->view('login.html');
	}
	public function chpwd()
	{
		$this->load->view('chpwd.html');
	}
	public function view()
	{
		$page = $this->input->post("page", true);
		if (empty($page))
			return;
		$this->load->view($page);
	}
}

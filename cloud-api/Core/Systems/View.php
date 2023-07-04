<?php

namespace Systems;

use Systems\Errors;

class View
{
	protected $array;
	protected $key;
	protected $val;
	/*
	* @param 变量渲染
	* @key:变量名
	* @value:变量值
	*/
	protected function assign($key, $val)
	{
		if (array($val)) {
			$this->array["{$key}"] = $val;
		} else {
			$this->array["{$key}"] = compact($val);
		}
	}
	/*
	* @param 模板渲染
	* @param $page:模板文件
	*/
	protected function fetch($page = null,$path ='')
	{
		if($this->array && is_array($this->array)){
			extract($this->array);
		}
		if ($page != null && file_exists($page)) {
			return include_once $page;
		}
		if (!$this->config['multi_app']) {
			$this->module = '';
		}
		if (empty($page)) {
			$page = explode("/", $this->module . "/" . $this->controller . "/" . $this->action);
			$page = end($page);
		}
		if (strpos($page, '.html')) {
			$return = $page;
		} else {
			$return = $page . ".html";
		}
		if($path){
			$this->controller = $path;
		}
		$return = strtolower($return);
		if (substr($return, 0, 1) == '/') {
			$return = $this->app_path . ucwords(strtolower($this->config['default_http_path'])) . '/' . ucwords(strtolower($this->module)) . '/' . $this->config['default_view_name'] . '/' . $return;
		} else {
			$return = $this->app_path . ucwords(strtolower($this->config['default_http_path'])) . '/' . ucwords(strtolower($this->module)) . '/' . $this->config['default_view_name'] . '/' . strtolower($this->controller)  . '/' . $return;
		}
		if (file_exists($return)) {
			include_once($return);
		} else {
			Errors::show("模板文件不存在</br>" . $return);
		}
	}
}

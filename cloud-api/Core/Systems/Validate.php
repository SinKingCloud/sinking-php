<?php
/*
 * Title:沉沦云MVC开发框架
 * Project:Validate功能类
 * Author:流逝中沉沦
 * QQ：1178710004
 */

namespace Systems;

class Validate
{
	//错误信息
	private $error = array();
	//传入的验证规则
	private $validate = array();
	//需要验证的参数
	private $data = array();
	//验证成功的参数
	private $succ_data = array();
	//添加的规则
	private $add_rules = array();
	//默认错误提示
	private $error_msg = array(
		'require' => ':attribute不能为空',
		'number' => ':attribute必须为数字',
		'array' => ':attribute必须为数组',
		'float' => ':attribute必须为浮点数',
		'boolean' => ':attribute必须为布尔值',
		'email' => ':attribute必须为正确的邮件地址',
		'url' => ':attribute必须为正确的url格式',
		'ip' => ':attribute必须为正确的ip地址',
		'timestamp' => ':attribute必须为正确的时间戳格式',
		'date' => ':attribute必须为正确的日期格式',
		'regex' => ':attribute格式不正确',
		'in' => ':attribute必须在:range内',
		'notIn' => ':attribute必须不在:range内',
		'between' => ':attribute必须在:1-:2范围内',
		'notBetween' => ':attribute必须不在:1-:2范围内',
		'max' => ':attribute最大值为:1',
		'min' => ':attribute最小值为:1',
		'length' => ':attribute长度必须为:1',
		'length_between' => ':attribute长度必须在:1到:2之间',
		'confirm' => ':attribute和:1不一致',
		'gt' => ':attribute必须大于:1',
		'lt' => ':attribute必须小于:1',
		'egt' => ':attribute必须大于等于:1',
		'elt' => ':attribute必须小于等于:1',
		'eq' => ':attribute必须等于:1',
		'account' => ':attribute必须由字母或数字组成'
	);
	public function __construct($validate = null)
	{
		$this->validate = $validate;
	}
	/**
	 * [validate 验证]
	 * @param [type] $data [需要验证的参数]
	 * @return [type]    [boolean]
	 */
	public function validate($data)
	{
		$this->data = $data;
		foreach ($this->validate as $key => $item) {
			$item_len = count($item);
			$name = $item[0];
			$rules = $item[1];
			$rules = explode('|', $rules);
			$message = $item_len > 2 ? explode('|', $item[2]) : null;
			$this->check($name, $rules, $message);
		}
		if (!empty($this->add_rules)) {
			$this->checkAddRules();
		}
		return empty($this->error) ? TRUE : FALSE;
	}

	public function getData()
	{
		return $this->succ_data;
	}
	/**
	 * [check 单个字段验证]
	 * @param [type] $name  [description]
	 * @param [type] $rules  [description]
	 * @param [type] $message [description]
	 * @return [type]     [null]
	 */
	private function check($name, $rules, $message)
	{
		$rule_name = $title = $name;
		if (strpos($name, '|')) {
			$temp_arr1 = explode('|', $name);
			$rule_name = $temp_arr1[0];
			$title = $temp_arr1[1];
		}
		$is_check = $this->checkDefaultValue($rule_name, $rules, $message);
		if (!$is_check) {
			return;
		}
		$num = count($rules);
		foreach ($rules as $i => $rule) {
			if (!$rule) continue;
			$arr = explode(':', $rule);
			$validate_data = isset($this->data[$rule_name]) ? $this->data[$rule_name] : null;
			if (count($arr) >= 1 && ($arr[0] == 'default' || $arr[0] == 'omitempty')) {
				if ($arr[0] == 'omitempty' && $num == 1) {
					$this->succ_data[$rule_name] = $validate_data;
				}
				continue;
			}
			$result = $this->checkResult($rule, $validate_data);
			if (!$result) {
				$error_info = isset($message[$i]) ? $message[$i] : $this->getMessage($title, $rule);
				if ($error_info) {
					array_push($this->error, $error_info);
				}
			} else {
				$this->succ_data[$rule_name] = $validate_data;
			}
		}
	}

	private function checkDefaultValue($name, $rules, $message)
	{
		$default = null;
		$is_set = false;
		foreach ($rules as $i => $rule) {
			if (!$rule) continue;
			$arr = explode(':', $rule);
			if (count($arr) >= 1) {
				if ($arr[0] == 'default') {
					$default = $arr[1];
				} else if ($arr[0] == 'omitempty') {
					$is_set = true;
				}
			}
		}
		if (isset($default) && (!isset($this->data[$name]) || $this->data[$name] === null || $this->data[$name] === '')) {
			$this->data[$name] = $default;
		}
		if ($is_set) {
			return isset($this->data[$name]) && $this->data[$name] !== '';
		} else {
			return true;
		}
	}
	/**
	 * [getMessage 获取验证失败的信息]
	 * @param [type] $name [字段名]
	 * @param [type] $rule [验证规则]
	 * @return [type]    [string OR fail false]
	 */
	private function getMessage($name, $rule)
	{
		$value1 = '';
		$value2 = '';
		$range = '';
		$error_key = $rule;
		if (strpos($rule, ':')) {
			$exp_arr = explode(':', $rule);
			$error_key = $exp_arr[0];
			$range = $exp_arr[1];
			$message_value = explode(',', $exp_arr[1]);
			$value1 = isset($message_value[0]) ? $message_value[0] : '';
			$value2 = isset($message_value[1]) ? $message_value[1] : '';
		}
		if (isset($this->error_msg[$error_key])) {
			return str_replace(array(':attribute', ':range', ':1', ':2'), array($name, $range, $value1, $value2), $this->error_msg[$error_key]);
		}
		return false;
	}
	/**
	 * [checkResult 字段验证]
	 * @param [type] $rule     [验证规则]
	 * @param [type] $validate_data [需要验证的数据]
	 * @return [type]        [boolean]
	 */
	private function checkResult($rule, $validate_data)
	{
		try {
			switch ($rule) {
				case 'require':
					return $validate_data !== null && $validate_data !== '';
					break;
				case 'number':
					if (is_array($validate_data)) {
						foreach ($validate_data as $value) {
							if (!is_numeric($value)) {
								return false;
							}
						}
						return true;
					}
					return is_numeric($validate_data);
					break;
				case 'array':
					return is_array($validate_data);
					break;
				case 'float':
					return filter_var($validate_data, FILTER_VALIDATE_FLOAT);
					break;
				case 'boolean':
					return filter_var($validate_data, FILTER_VALIDATE_BOOLEAN);
					break;
				case 'email':
					return filter_var($validate_data, FILTER_VALIDATE_EMAIL);
					break;
				case 'url':
					return filter_var($validate_data, FILTER_SANITIZE_URL);
				case 'ip':
					return filter_var($validate_data, FILTER_VALIDATE_IP);
					break;
				case 'timestamp':
					$datetime = new \DateTime($validate_data);
					return $datetime->format('U') == $validate_data;
					break;
				case 'date':
					$datetime = new \DateTime($validate_data);
					return $datetime->format('U');
					break;
				case 'account':
					return preg_match('/^[A-Za-z0-9_]{4,20}$/', $validate_data);
					break;
				default:
					if (strpos($rule, ':')) {
						$rule_arr = explode(':', $rule);
						$func_name = substr($rule, strpos($rule, ':') + 1);
						return call_user_func_array(array($this, $rule_arr[0]), array($func_name, $validate_data));
					} else {
						return call_user_func_array(array($this, $rule), array($rule, $validate_data));
					}
					break;
			}
		} catch (\Exception $th) {
			return false;
		}
	}
	/**
	 * 获取数组维数
	 *
	 * @param [type] $vDim
	 * @return void
	 */
	private function getMaxDim($vDim)
	{
		if (!is_array($vDim)) return 0;
		else {
			$max1 = 0;
			foreach ($vDim as $item1) {
				$t1 = $this->getMaxDim($item1);
				if ($t1 > $max1) $max1 = $t1;
			}
			return $max1 + 1;
		}
	}
	/**
	 * [regex 正则验证]
	 * @param [type] $rule [description]
	 * @param [type] $data [description]
	 * @return [type]    [description]
	 */
	public static function regex($rule, $data)
	{
		return filter_var($data, FILTER_VALIDATE_REGEXP, array("options" => array("regexp" => $rule)));
	}
	/**
	 * [addRule 添加规则格式 array()]
	 * @param [type] $rule [description]
	 */
	public function addRule($rule)
	{
		if (is_array(current($rule))) {
			$this->add_rules = array_merge($this->add_rules, $rule);
		} else {
			array_push($this->add_rules, $rule);
		}
	}
	/**
	 * [checkAddRules 添加新的规则的验证]
	 * @return [type] [description]
	 */
	public function checkAddRules()
	{
		foreach ($this->add_rules as $key => $item) {
			$name = $item[0];
			$message = isset($item[3]) ? $item[3] : null;
			$rule_name = $title = $name;
			if (strpos($name, '|')) {
				$temp_arr1 = explode('|', $name);
				$rule_name = $temp_arr1[0];
				$title = $temp_arr1[1];
			}
			$validate_data = isset($this->data[$rule_name]) ? $this->data[$rule_name] : null;
			$result = $this->checkResult($item[1] . ':' . $item[2], $validate_data);
			if (!$result) {
				$error_info = isset($message) ? $message : $this->getMessage($title, $item[1]);
				if ($error_info) {
					array_push($this->error, $error_info);
				}
			}
		}
	}
	/**
	 * [in description]
	 * @param [type] $rule [验证规则]
	 * @param [type] $data [需要验证的数据]
	 * @return [type]    [boolean]
	 */
	public static function in($rule, $data)
	{
		if (!is_array($rule)) {
			$rule = explode(',', $rule);
		}
		return in_array($data, $rule);
	}
	/**
	 * [in description]
	 * @param [type] $rule [验证规则]
	 * @param [type] $data [需要验证的数据]
	 * @return [type]    [boolean]
	 */
	public static function notIn($rule, $data)
	{
		return !$this->in($data, $rule);
	}
	/**
	 * [in description]
	 * @param [type] $rule [验证规则]
	 * @param [type] $data [需要验证的数据]
	 * @return [type]    [boolean]
	 */
	public static function between($rule, $data)
	{
		$rule = explode(',', $rule);
		$a = 0;
		$b = 0;
		if (count($rule) == 2) {
			$a = intval($rule[0]);
			$b = intval($rule[1]);
		} else {
			$a = intval($rule[0]);
		}
		return $data >= $a && $data <= $b;
	}
	/**
	 * [in description]
	 * @param [type] $rule [验证规则]
	 * @param [type] $data [需要验证的数据]
	 * @return [type]    [boolean]
	 */
	public static function notBetween($rule, $data)
	{
		return !$this->between($rule, $data);
	}
	/**
	 * [in description]
	 * @param [type] $rule [验证规则]
	 * @param [type] $data [需要验证的数据]
	 * @return [type]    [boolean]
	 */
	public static function max($rule, $data)
	{
		return $data <= $rule;
	}
	/**
	 * [in description]
	 * @param [type] $rule [验证规则]
	 * @param [type] $data [需要验证的数据]
	 * @return [type]    [boolean]
	 */
	public static function min($rule, $data)
	{
		return $data >= $rule;
	}
	/**
	 * [in description]
	 * @param [type] $rule [验证规则]
	 * @param [type] $data [需要验证的数据]
	 * @return [type]    [boolean]
	 */
	public static function length($rule, $data)
	{
		$length = is_array($data) ? count($data) : strlen($data);
		return $length == $rule;
	}

	/**
	 * [in description]
	 * @param [type] $rule [验证规则]
	 * @param [type] $data [需要验证的数据]
	 * @return [type]    [boolean]
	 */
	public static function length_between($rule, $data)
	{
		$min = 0;
		$max = 0;
		$arr = explode(',', $rule);
		if (count($arr) == 2) {
			$min  = intval($arr[0]);
			$max = intval($arr[1]);
		}
		if (is_array($data)) {
			$n = count($data);
		} else {
			$n = mb_strlen($data, 'UTF-8');
		}
		return $n >= $min && $n <= $max;
	}
	/**
	 * [in description]
	 * @param [type] $rule [验证规则]
	 * @param [type] $data [需要验证的数据]
	 * @return [type]    [boolean]
	 */
	public static function confirm($rule, $data)
	{
		return isset($this->data[$rule]) && $data == $this->data[$rule];
	}
	public static function gt($rule, $data)
	{
		return $data > $rule;
	}
	public static function lt($rule, $data)
	{
		return $data < $rule;
	}
	public static function egt($rule, $data)
	{
		return $data >= $rule;
	}
	public static function elt($rule, $data)
	{
		return $data <= $rule;
	}
	public static function eq($rule, $data)
	{
		return $data == $rule;
	}
	/**
	 * [in 获取验证失败的第一条信息]
	 * @return [type] [string]
	 */
	public function getError()
	{
		return count($this->error) > 0 ? $this->error[0] : null;
	}
	/**
	 * [getAllErrors 获取所有验证失败的信息]
	 * @return [type] [array]
	 */
	public function getAllErrors()
	{
		return $this->error;
	}
	/**
	 * [__call 调用自定义函数或者]
	 * @param [type] $func [验证规则，函数名]
	 * @param [type] $data [验证数据]
	 * @return [type]    [boollean]
	 */
	function __call($func, $data)
	{
		$func_arr = get_defined_functions();
		if (in_array($func, $func_arr['user'])) {
			return call_user_func($func, $data);
		} else {
			array_push($this->error, '没有' . $func . '这个方法');
		}
	}
	/**
	 * [__callStatic 静态方法调用自定义函数或者]
	 * @param [type] $func [验证规则，函数名]
	 * @param [type] $data [验证数据]
	 * @return [type]    [boollean]
	 */
	public static function __callStatic($func, $data)
	{
		if (substr($func, 0, 2) == 'is') {
			return call_user_func_array(array(new self, 'checkResult'), array(strtolower(substr($func, 2)), $data[0]));
		}
	}
}

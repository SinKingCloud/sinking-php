<?php

namespace Plugins\SinKingCloud;

class Oauth extends Client
{
	private $oauth_id = 1; //网站接入ID

	public function setOauthId($oauth_id)
	{
		$this->oauth_id = $oauth_id;
		return $this;
	}

	public function genTicket($redirectUrl)
	{
		$response = $this->request("/open/api/oauth/gen_ticket", array("oauth_id" => $this->oauth_id));
		return $response->getResponseData();
	}

	public function getUserInfo($ticket)
	{
		$response = $this->request("/open/api/oauth/get_user_info", array("oauth_id" => $this->oauth_id, 'ticket' => $ticket));
		return $response->getResponseData();
	}
}

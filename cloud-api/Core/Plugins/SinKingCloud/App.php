<?php

namespace Plugins\SinKingCloud;

class App extends Client
{
    public function getAppInfo()
    {
        $data = $this->request("/open/api/app/info")->getResponse();
        if ($data['code'] == 200) {
            return $data['data'];
        }
        return false;
    }

    public function checkUpgrade($code, $version_number = 0)
    {
        return $this->request("/open/api/auth/upgrade?" . http_build_query(array(
            'code' => $code,
            'version_number' => $version_number,
        )))->getResponse();
    }

    public function getPkg($code, $version_number = 0, $type = 'upgrade')
    {
        $data = $this->request("/open/api/auth/package?" . http_build_query(array(
            'code' => $code,
            'version_number' => $version_number,
            'type' => $type,
        )))->getResponse();
        if ($data['code'] == 200) {
            return $data['data'];
        }
        return false;
    }
}

<?php

namespace Systems;

class Exception extends \Exception
{
    public function handle()
    {
        Errors::show($this->message);
    }
}

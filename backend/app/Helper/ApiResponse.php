<?php

namespace App\Helper;

class ApiResponse{
    public static function success($data = [],$message = ""){
         return response()->json([
                "type"  =>  "success",
                "data"  =>  $data,
                "message"   =>  $message
            ],200);
    }

    public static function error($message = ""){
         return response()->json([
                "type"  =>  "error",
                "message"   =>  $message
            ],400);
    }
}
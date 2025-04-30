<?php

namespace App\Http\Controllers\Api;

use App\Helper\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\Auth\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Mockery\CountValidator\Exception;

class AuthController extends Controller
{
    public function register(RegisterRequest $request)
    {
         try {
                $validated = $request->validated();
                $user = User::create($validated);
                $token = $user->createToken($user->id."-AuthToken")->plainTextToken;

                
                return ApiResponse::success([
                    'user' => UserResource::make($user),
                    'token' => $token
                ],'User registered successfully');
         } catch (Exception $e) {
            return ApiResponse::error($e->getMessage());
         }
        
    }

    public function login(LoginRequest $request)
    {
        try {
            //code...
            $credintials  = $request->validated();
            if(auth()->attempt($credintials)){
                $user = auth()->user();
                $token = $user->createToken($user->id."-AuthToken")->plainTextToken;
                return ApiResponse::success([
                    'user' => UserResource::make($user),
                    'token' => $token
                ],'User logged in successfully');
            }
            throw new Exception("Invalid credentials");
            
        } catch (Exception $e) {
            //throw $th;
            return ApiResponse::error($e->getMessage());
        }
    }

    public function logout(Request $request){
        try {
            $user = auth()->user();
            $user->tokens()->delete();
            return ApiResponse::success([], "Logout successfull");
        } catch (Exception $e) {
            return ApiResponse::error($e->getMessage());
        }
    }
}
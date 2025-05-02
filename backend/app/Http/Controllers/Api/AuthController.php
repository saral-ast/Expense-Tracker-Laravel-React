<?php

namespace App\Http\Controllers\Api;

use App\Helper\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\Auth\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Exception; // ✅ Correct import

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
            ], 'User registered successfully');
        } catch (Exception $e) {
            return ApiResponse::error($e->getMessage(),[
                
            ]);
        }
    }

    public function login(LoginRequest $request)
    {
        try {
            $credentials = $request->validated();

            if (!auth()->attempt($credentials)) {
                // Custom exception message
                throw new Exception('Invalid email or password.');
            }

            $user = auth()->user();
            $token = $user->createToken($user->id."-AuthToken")->plainTextToken;

            return ApiResponse::success([
                'user' => UserResource::make($user),
                'token' => $token
            ], 'User logged in successfully');

        } catch (Exception $e) {
            return ApiResponse::error($e->getMessage(),[
                'data' => "Invalid email or password."
            ]);
        }
    }

    public function logout(Request $request)
    {
        try {
            $user = auth()->user();
            $user->tokens()->delete();
            return ApiResponse::success([], "Logout successful");
        } catch (Exception $e) {
            return ApiResponse::error($e->getMessage());
        }
    }
}
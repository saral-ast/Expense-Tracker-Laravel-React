<?php

namespace App\Http\Controllers\Api;

use App\Helper\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Group\GrupRequest;
use App\Http\Resources\GroupResource;
use Exception;
use Illuminate\Http\Request;

class GroupController extends Controller
{
    public function index()
    {
        try {
            //code...
            $groups = auth()->user()->groups;
            return ApiResponse::success([
                'groups' => GroupResource::collection($groups)
            ], 'Groups fetched successfully');
        } catch (Exception $e) {
            //throw $th;
            ApiResponse::error($e->getMessage());
        }
    }   
    
    public function store(GrupRequest $request){
         try {
            //code...
            $validated = $request->validated();
            $group = auth()->user()->groups()->create($validated);
            return ApiResponse::success([
                'group' => GroupResource::make($group)
            ], 'Group created successfully');
         } catch (Exception $e) {
             //throw $th;
             return ApiResponse::error($e->getMessage());
         }
    }
    public function update(GrupRequest $request, $id){
        try {
            //code...
            // return ApiResponse::error('Method not implemented');
            $validated = $request->validated();
            $group = auth()->user()->groups()->findOrFail($id);
            $group->update($validated);
            return ApiResponse::success([
                'group' => GroupResource::make($group)
            ], 'Group updated successfully');
         } catch (Exception $e) {
             //throw $th;
             return ApiResponse::error($e->getMessage());
         }
    }
    
    public function destroy($id){
        try {
            //code...
            $group = auth()->user()->groups()->findOrFail($id);
            $group->delete();
            return ApiResponse::success([], 'Group deleted successfully');
         } catch (Exception $e) {
             //throw $th;
             return ApiResponse::error($e->getMessage());
         }
    }
}
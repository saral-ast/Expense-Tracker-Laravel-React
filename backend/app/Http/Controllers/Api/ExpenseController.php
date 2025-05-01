<?php

namespace App\Http\Controllers\Api;

use App\Helper\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Expense\ExpenseRequest;
use App\Http\Resources\ExpenseResource;
use Exception;
use Illuminate\Http\Request;
use App\Models\Expense;

class ExpenseController extends Controller
{
    public function index(){
        try {
            //code...
            // $groups = auth()->user()->groups();
            // $expenses = $groups->expenses;
             $expenses = auth()->user()->expenses()->with('group')->get();
            
            return ApiResponse::success([
                'expenses'=> ExpenseResource::collection($expenses)
            ], 'Expenses fetched successfully');
        } catch (Exception $e) {
            //throw $th;
            return ApiResponse::error($e->getMessage());
        }
        
    }
    public function store(ExpenseRequest $request){
        try {
            //code...
            $validated = $request->validated();
            $validated['user_id'] = auth()->user()->id;
            $expense = auth()->user()->expenses()->create($validated);
            return ApiResponse::success([
                'expense' => ExpenseResource::make($expense)
            ], 'Expense created successfully');
        } catch (Exception $e) {
            //throw $th;
            return ApiResponse::error($e->getMessage());
        }
    }

    public function update(ExpenseRequest $request, $id){
        try {
            //code...
            $validated = $request->validated();
            $expense = auth()->user()->expenses()->findOrFail($id);
            $expense->update($validated);
            return ApiResponse::success([
                'expense' => ExpenseResource::make($expense)
            ], 'Expense updated successfully');
        } catch (Exception $e) {
            //throw $th;
            return ApiResponse::error($e->getMessage());
        }
    }
    public function destroy($id){
        try {
            //code...
            $expense = auth()->user()->expenses()->findOrFail($id);
            $expense->delete();
            return ApiResponse::success(['id' => $id], 'Expense deleted successfully');
        } catch (Exception $e) {
            //throw $th;
            return ApiResponse::error($e->getMessage());
        }
    }
}
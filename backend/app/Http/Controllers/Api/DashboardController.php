<?php

namespace App\Http\Controllers\Api;

use App\Helper\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\ExpenseResource;
use Exception;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        try {
            // ApiResponse::error('Method not implemented');
            $totalExpenses = auth()->user()->expenses()->sum('amount');
            $highestExpense = auth()->user()->expenses()->orderBy('amount', 'desc')->first();
             $totalthisMonth = auth()->user()->expenses()
            ->whereMonth('date', date('m'))
            ->whereYear('date', date('Y'))
            ->sum('amount');
            

          return  ApiResponse::success([
                'total_expenses' => $totalExpenses,
                'highest_expense' => $highestExpense->amount,
                'total_this_month' => $totalthisMonth
            ], 'Dashboard data fetched successfully');
        } catch (Exception $e) {
            return ApiResponse::error($e->getMessage());
        }

        

        
    }
}
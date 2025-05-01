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
            $totalExpenses = auth()->user()->expenses()->sum('amount') ?? 0;
            
            // Get the highest expense properly
            $highestExpense = auth()->user()->expenses()->orderBy('amount', 'desc')->first();
            $highestExpenseAmount = $highestExpense ? $highestExpense->amount : 0;
            
            $totalthisMonth = auth()->user()->expenses()
                ->whereMonth('date', date('m'))
                ->whereYear('date', date('Y'))
                ->sum('amount') ?? 0;
                
            $recentExpenses = auth()->user()->expenses()
                ->orderBy('created_at', 'desc')
                ->take(5)
                ->get() ?? [];
            
            return ApiResponse::success([
                'total_expenses' => $totalExpenses,
                'highest_expense' => $highestExpenseAmount,
                'total_this_month' => $totalthisMonth,
                'recent_expenses' => ExpenseResource::collection($recentExpenses)
            ], 'Dashboard data fetched successfully');
        } catch (Exception $e) {
            return ApiResponse::error($e->getMessage());
        }
    }
}
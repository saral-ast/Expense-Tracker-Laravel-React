<?php

namespace App\Http\Controllers\Api;


use App\Helper\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Expense\ExpenseRequest;
use App\Http\Resources\ExpenseResource;
// use Barryvdh\DomPDF\PDF;
use Exception;
use App\Exports\ExpensesExport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Response;



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
            $expense->load('group');
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
            $expense->load('group');
            
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

     public function exportCsv(Request $request)
    {
        $fileName = 'expenses-' . now()->format('Y-m-d') . '.csv';
            $csvPath = 'csv/' . $fileName;
            Excel::store(new ExpensesExport(), $csvPath, 'public');

            return response()->json([
                'success' => true,
                'file_url' => asset('storage/' . $csvPath)
            ]);
        
        // return Excel::download(new ExpensesExport($userId, $groupId), 'expenses.csv');
    }


 


public function exportPdf(Request $request)
{
    try {
        $expenses = auth()->user()->expenses()->with('group')->get();
        $totalAmount = $expenses->sum('amount');

        $pdf = Pdf::loadView('expenses.pdf', [
            'expenses' => $expenses,
            'totalAmount' => $totalAmount
        ]);

        return Response::make($pdf->output(), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="expenses_report.pdf"',
        ]);
    } catch (Exception $e) {
        return response()->json([
            'success' => false,
            'message' => $e->getMessage()
        ], 500);
    }
}


}
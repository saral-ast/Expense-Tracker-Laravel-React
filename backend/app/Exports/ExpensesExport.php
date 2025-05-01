<?php

namespace App\Exports;

use App\Models\Expense;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class ExpensesExport implements FromCollection, WithHeadings, WithMapping
{
    protected $userId;
    protected $groupId;

    public function __construct($userId = null, $groupId = null)
    {
        $this->userId = $userId;
        $this->groupId = $groupId;
    }

    public function collection()
    {
        $query = Expense::query();
        
        if ($this->userId) {
            $query->where('user_id', $this->userId);
        }
        
        if ($this->groupId) {
            $query->where('group_id', $this->groupId);
        }
        
        return $query->with(['user', 'group'])->get();
    }

    public function headings(): array
    {
        return [
            'ID',
            'Description',
            'Amount',
            'Date',
            'Group',
            'User',
            'Created At'
        ];
    }

    public function map($expense): array
    {
        return [
            $expense->id,
            $expense->description,
            $expense->amount,
            $expense->date,
            $expense->group ? $expense->group->name : 'N/A',
            $expense->user ? $expense->user->name : 'N/A',
            $expense->created_at->format('Y-m-d H:i:s')
        ];
    }
}
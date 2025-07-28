<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>របាយការណ៍ប្រចាំខែ</title>
    <style>
        @font-face {
            font-family: 'Koh Santepheap';
            src: url("{!! storage_path('fonts/KohSantepheap-Regular.ttf') !!}") format('truetype');
            font-weight: normal;
            font-style: normal;
        }
        @font-face {
            font-family: 'Koh Santepheap';
            src: url("{!! storage_path('fonts/KohSantepheap-Bold.ttf') !!}") format('truetype');
            font-weight: bold;
            font-style: normal;
        }
        body {
            font-family: serif;
            margin: 0;
            padding: 20px;
            font-size: 12px;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 10px;
        }
        .header h1 {
            margin: 0;
            color: #333;
            font-size: 24px;
        }
        .header p {
            margin: 5px 0;
            color: #666;
            font-size: 14px;
        }
        .summary-box {
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 5px;
        }
        .summary-title {
            font-weight: bold;
            font-size: 16px;
            margin-bottom: 10px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
        }
        .summary-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
        }
        .summary-label {
            font-weight: bold;
            width: 150px;
        }
        .summary-value {
            text-align: right;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        table, th, td {
            border: 1px solid #ddd;
        }
        th {
            background-color: #f2f2f2;
            padding: 8px;
            text-align: left;
            font-weight: bold;
        }
        td {
            padding: 8px;
            vertical-align: top;
        }
        .month-header {
            background-color: #e2efda;
            font-weight: bold;
            font-size: 16px;
            padding: 10px;
            margin-top: 20px;
            margin-bottom: 10px;
            border-radius: 5px;
        }
        .status-paid {
            color: green;
        }
        .status-overdue {
            color: red;
        }
        .status-pending {
            color: orange;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 10px;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 10px;
        }
        .page-break {
            page-break-after: always;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>📊 របាយការណ៍ការបង់ប្រាក់ប្រចាំខែ</h1>
        <p>រយៈពេល៖ {{ $summary['start_date'] }} ដល់ {{ $summary['end_date'] }}</p>
        <p>បង្កើតដោយ៖ {{ $exported_by }} នៅ {{ $exported_at }}</p>
    </div>
    
    <div class="summary-box">
        <div class="summary-title">Summary</div>
        <div class="summary-row">
            <span class="summary-label">Total Amount:</span>
            <span class="summary-value">${{ number_format($summary['total_amount'], 2) }}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Total Paid:</span>
            <span class="summary-value">${{ number_format($summary['total_amount'] ?? 0, 2) }}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Total Overdue:</span>
            <span class="summary-value status-overdue">$0.00</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Total Pending:</span>
            <span class="summary-value">$0.00</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Total Payments:</span>
            <span class="summary-value">{{ $summary['payment_steps_count'] ?? 0 }}</span>
        </div>
    </div>
    
    <div class="summary-title">Monthly Breakdown</div>
    <table>
        <thead>
            <tr>
                <th>Month</th>
                <th>Total Amount</th>
                <th>Paid</th>
                <th>Overdue</th>
                <th>Pending</th>
            </tr>
        </thead>
        <tbody>
            @if(isset($monthly_data) && count($monthly_data) > 0)
                @foreach($monthly_data as $month => $data)
                <tr>
                    <td>{{ $data['month_name'] ?? $month }}</td>
                    <td>${{ number_format($data['total_amount'] ?? 0, 2) }}</td>
                    <td class="status-paid">${{ number_format($data['total_paid'] ?? 0, 2) }}</td>
                    <td class="status-overdue">${{ number_format($data['total_overdue'] ?? 0, 2) }}</td>
                    <td>${{ number_format($data['total_pending'] ?? 0, 2) }}</td>
                </tr>
                @endforeach
            @else
                <tr>
                    <td colspan="5" style="text-align: center; padding: 20px;">គ្មានទិន្នន័យសម្រាប់ខែនេះ</td>
                </tr>
            @endif
        </tbody>
    </table>
    
    <div class="page-break"></div>
    
    @if(isset($monthly_data) && count($monthly_data) > 0)
        @foreach($monthly_data as $month => $data)
        <div class="month-header">{{ $data['month_name'] ?? $month }}</div>
    
    <table>
        <thead>
            <tr>
                <th>Contract ID</th>
                <th>Step</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Buyer</th>
                <th>Land Plot</th>
            </tr>
        </thead>
        <tbody>
            @foreach($data['payment_steps'] as $step)
            <tr>
                <td>{{ $step['contract_id'] }}</td>
                <td>{{ $step['step_number'] }}</td>
                <td>{{ $step['payment_description'] }}</td>
                <td>${{ number_format($step['amount'], 2) }}</td>
                <td>{{ $step['due_date'] }}</td>
                <td class="status-{{ strtolower($step['status']) }}">{{ ucfirst($step['status']) }}</td>
                <td>{{ $step['buyer_name'] }}</td>
                <td>{{ $step['land_info']['plot_number'] }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
    
    <div class="summary-box">
        <div class="summary-row">
            <span class="summary-label">Month Total:</span>
            <span class="summary-value">${{ number_format($data['total_amount'], 2) }}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Month Paid:</span>
            <span class="summary-value">${{ number_format($data['total_paid'] ?? 0, 2) }}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Month Overdue:</span>
            <span class="summary-value">$0.00</span>
        </div>
    </div>
    
        @if(!$loop->last)
        <div class="page-break"></div>
        @endif
        @endforeach
    @else
        <div style="text-align: center; padding: 40px;">
            <h3>គ្មានទិន្នន័យលម្អិតសម្រាប់ខែនេះ</h3>
        </div>
    @endif
    
    <div class="footer">
        <p>ONC Land Purchase Tracking System &copy; {{ date('Y') }}</p>
    </div>
</body>
</html>

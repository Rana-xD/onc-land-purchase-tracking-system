<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>របាយការណ៍ស្ថានភាពការបង់ប្រាក់</title>
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
            font-family: "DejaVu Sans", sans-serif;
            margin: 0;
            padding: 20px;
            font-size: 14px;
            line-height: 1.6;
            color: #333;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #28a745;
            padding-bottom: 15px;
        }
        .header h1 {
            margin: 0;
            color: #28a745;
            font-size: 28px;
            font-weight: bold;
        }
        .header .subtitle {
            margin: 10px 0 5px 0;
            color: #666;
            font-size: 18px;
        }
        .header .meta {
            margin: 5px 0;
            color: #888;
            font-size: 12px;
        }
        .summary-section {
            background: linear-gradient(135deg, #f8fff8 0%, #e8f5e8 100%);
            border: 2px solid #28a745;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 25px;
        }
        .summary-title {
            font-weight: bold;
            font-size: 20px;
            margin-bottom: 15px;
            color: #28a745;
            text-align: center;
            border-bottom: 2px solid #28a745;
            padding-bottom: 8px;
        }
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
        }
        .summary-item {
            background: white;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            border-left: 4px solid #28a745;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .summary-value {
            font-size: 24px;
            font-weight: bold;
            color: #28a745;
            display: block;
            margin-bottom: 5px;
        }
        .summary-label {
            font-size: 14px;
            color: #666;
            font-weight: bold;
        }
        .contracts-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .contracts-table thead {
            background: #28a745;
            color: white;
        }
        .contracts-table th {
            padding: 12px 8px;
            text-align: left;
            font-weight: bold;
            font-size: 13px;
            border-right: 1px solid rgba(255,255,255,0.2);
        }
        .contracts-table th:last-child {
            border-right: none;
        }
        .contracts-table tbody tr:nth-child(even) {
            background: #f8f9fa;
        }
        .contracts-table tbody tr:hover {
            background: #e8f5e8;
        }
        .contracts-table td {
            padding: 10px 8px;
            border-bottom: 1px solid #ddd;
            font-size: 12px;
            vertical-align: top;
        }
        .status-badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .status-paid {
            background: #d4edda;
            color: #155724;
        }
        .status-pending {
            background: #fff3cd;
            color: #856404;
        }
        .status-overdue {
            background: #f8d7da;
            color: #721c24;
        }
        .amount-paid {
            color: #28a745;
            font-weight: bold;
        }
        .amount-pending {
            color: #ffc107;
            font-weight: bold;
        }
        .amount-overdue {
            color: #dc3545;
            font-weight: bold;
        }
        .section-title {
            font-size: 20px;
            font-weight: bold;
            margin: 30px 0 15px 0;
            color: #28a745;
            border-bottom: 2px solid #28a745;
            padding-bottom: 8px;
        }
        .payment-details {
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .contract-header {
            background: #28a745;
            color: white;
            padding: 10px 15px;
            margin: -20px -20px 15px -20px;
            border-radius: 8px 8px 0 0;
            font-weight: bold;
            font-size: 16px;
        }
        .payment-steps-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        .payment-steps-table th {
            background: #f8f9fa;
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
            font-weight: bold;
            font-size: 12px;
        }
        .payment-steps-table td {
            border: 1px solid #ddd;
            padding: 8px;
            font-size: 11px;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            font-size: 11px;
            color: #666;
            border-top: 2px solid #28a745;
            padding-top: 15px;
        }
        .page-break {
            page-break-after: always;
        }
        .progress-bar {
            width: 100%;
            height: 20px;
            background: #e9ecef;
            border-radius: 10px;
            overflow: hidden;
            margin: 5px 0;
        }
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #28a745 0%, #20c997 100%);
            transition: width 0.3s ease;
        }
        .progress-text {
            font-size: 11px;
            font-weight: bold;
            color: #666;
            margin-top: 2px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>💳 របាយការណ៍ស្ថានភាពការបង់ប្រាក់</h1>
        <div class="subtitle">ប្រព័ន្ធតាមដានការទិញដី</div>
        <div class="meta">បង្កើតដោយ៖ {{ $exported_by }} | កាលបរិច្ឆេទ៖ {{ $exported_at }}</div>
    </div>

    <div class="summary-section">
        <div class="summary-title">📊 សង្ខេបស្ថានភាពការបង់ប្រាក់</div>
        <div class="summary-grid">
            <div class="summary-item">
                <span class="summary-value">{{ $summary['contracts_count'] ?? 0 }}</span>
                <span class="summary-label">📋 សរុបកិច្ចសន្យា</span>
            </div>
            <div class="summary-item">
                <span class="summary-value amount-paid">${{ number_format($summary['total_paid'] ?? 0, 2) }}</span>
                <span class="summary-label">✅ បានបង់</span>
            </div>
            <div class="summary-item">
                <span class="summary-value amount-overdue">${{ number_format($summary['total_unpaid'] ?? 0, 2) }}</span>
                <span class="summary-label">⏰ មិនទាន់បង់</span>
            </div>
        </div>
    </div>

    <div class="section-title">📑 ព័ត៌មានលម្អិតកិច្ចសន្យា</div>

    @if(isset($contracts) && count($contracts) > 0)
        <table class="contracts-table">
            <thead>
                <tr>
                    <th>🏠 កិច្ចសន្យា</th>
                    <th>👤 អ្នកទិញ</th>
                    <th>🏞️ លេខក្បាលដី</th>
                    <th>💰 តម្លៃសរុប</th>
                    <th>✅ បានបង់</th>
                    <th>⏰ មិនទាន់បង់</th>
                    <th>📈 ភាគរយ</th>
                    <th>📊 ស្ថានភាព</th>
                </tr>
            </thead>
            <tbody>
                @foreach($contracts as $contract)
                <tr>
                    <td><strong>{{ $contract['contract_id'] }}</strong></td>
                    <td>{{ $contract['buyer_name'] ?? 'មិនមាន' }}</td>
                    <td>{{ $contract['plot_number'] ?? 'មិនមាន' }}</td>
                    <td><strong>${{ number_format($contract['total_amount'] ?? 0, 2) }}</strong></td>
                    <td class="amount-paid">${{ number_format($contract['paid_amount'] ?? 0, 2) }}</td>
                    <td class="amount-pending">${{ number_format($contract['unpaid_amount'] ?? 0, 2) }}</td>
                    <td>
                        @php
                            $percentage = $contract['total_amount'] > 0 ? round(($contract['paid_amount'] / $contract['total_amount']) * 100, 1) : 0;
                        @endphp
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: {{ $percentage }}%"></div>
                        </div>
                        <div class="progress-text">{{ $percentage }}%</div>
                    </td>
                    <td>
                        @if($percentage >= 100)
                            <span class="status-badge status-paid">បានបញ្ចប់</span>
                        @elseif($percentage >= 50)
                            <span class="status-badge status-pending">កំពុងដំណើរការ</span>
                        @else
                            <span class="status-badge status-overdue">ចាំបាច់ពិនិត្យ</span>
                        @endif
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <div class="page-break"></div>

        <div class="section-title">💳 ព័ត៌មានលម្អិតការបង់ប្រាក់</div>

        @foreach($contracts as $contract)
        <div class="payment-details">
            <div class="contract-header">
                🏠 កិច្ចសន្យាលេខ៖ {{ $contract['contract_id'] }}
                @if(isset($contract['buyer_name']))
                    - 👤 {{ $contract['buyer_name'] }}
                @endif
            </div>

            @if(isset($contract['payment_steps']) && count($contract['payment_steps']) > 0)
                <table class="payment-steps-table">
                    <thead>
                        <tr>
                            <th>📝 ជំហាន</th>
                            <th>📄 ការពិពណ៌នា</th>
                            <th>💰 ចំនួនទឹកប្រាក់</th>
                            <th>📅 កាលបរិច្ឆេទ</th>
                            <th>📊 ស្ថានភាព</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($contract['payment_steps'] as $step)
                        <tr>
                            <td><strong>{{ $step['step_number'] ?? 'N/A' }}</strong></td>
                            <td>{{ $step['description'] ?? 'មិនមានការពិពណ៌នា' }}</td>
                            <td class="amount-{{ strtolower($step['status'] ?? 'pending') }}">
                                <strong>${{ number_format($step['amount'] ?? 0, 2) }}</strong>
                            </td>
                            <td>{{ $step['due_date'] ?? 'មិនកំណត់' }}</td>
                            <td>
                                @php
                                    $status = strtolower($step['status'] ?? 'pending');
                                    $statusText = $status === 'paid' ? 'បានបង់' : ($status === 'overdue' ? 'ហួសកាលកំណត់' : 'មិនទាន់បង់');
                                @endphp
                                <span class="status-badge status-{{ $status }}">{{ $statusText }}</span>
                            </td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            @else
                <p style="text-align: center; color: #666; font-style: italic;">មិនមានព័ត៌មានការបង់ប្រាក់</p>
            @endif
        </div>

        @if($loop->iteration % 3 == 0 && !$loop->last)
        <div class="page-break"></div>
        @endif
        @endforeach
    @else
        <div style="text-align: center; padding: 40px; color: #666;">
            <h3>មិនមានកិច្ចសន្យាសម្រាប់បង្ហាញ</h3>
            <p>សូមពិនិត្យមើលការកំណត់ក្រុមហ៊ុន ឬទាក់ទងអ្នកគ្រប់គ្រង</p>
        </div>
    @endif

    <div class="footer">
        <p><strong>🏢 ប្រព័ន្ធតាមដានការទិញដី ONC</strong></p>
        <p>របាយការណ៍នេះត្រូវបានបង្កើតដោយស្វ័យប្រវត្តិ និងមានសុពលភាពពេញលេញ</p>
        <p>&copy; {{ date('Y') }} - ការទិញដីកម្ពុជា</p>
    </div>
</body>
</html>

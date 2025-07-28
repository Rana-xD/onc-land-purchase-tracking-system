<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>របាយការណ៍ប្រចាំឆ្នាំ {{ $year }}</title>
    <style>
        body {
            font-family: serif;
            margin: 0;
            padding: 20px;
            font-size: 14px;
            line-height: 1.6;
            color: #333;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #4472C4;
            padding-bottom: 15px;
        }
        .header h1 {
            margin: 0;
            color: #4472C4;
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
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border: 2px solid #4472C4;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 25px;
        }
        .summary-title {
            font-weight: bold;
            font-size: 20px;
            margin-bottom: 15px;
            color: #4472C4;
            text-align: center;
            border-bottom: 2px solid #4472C4;
            padding-bottom: 8px;
        }
        .summary-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }
        .summary-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: white;
            padding: 12px 15px;
            border-radius: 8px;
            border-left: 4px solid #4472C4;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .summary-label {
            font-weight: bold;
            color: #333;
        }
        .summary-value {
            font-weight: bold;
            color: #4472C4;
            font-size: 16px;
        }
        .contracts-section {
            margin-bottom: 30px;
        }
        .section-title {
            font-size: 22px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #4472C4;
            border-bottom: 2px solid #4472C4;
            padding-bottom: 8px;
        }
        .contract-card {
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            margin-bottom: 20px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .contract-header {
            background: #4472C4;
            color: white;
            padding: 12px 15px;
            font-weight: bold;
            font-size: 16px;
        }
        .contract-info {
            padding: 15px;
        }
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-bottom: 15px;
        }
        .info-item {
            display: flex;
            align-items: center;
        }
        .info-label {
            font-weight: bold;
            width: 120px;
            color: #555;
        }
        .info-value {
            color: #333;
        }
        .monthly-breakdown {
            margin-top: 15px;
        }
        .monthly-title {
            font-weight: bold;
            font-size: 16px;
            margin-bottom: 10px;
            color: #4472C4;
        }
        .monthly-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }
        .monthly-table th {
            background: #f8f9fa;
            border: 1px solid #ddd;
            padding: 8px;
            text-align: center;
            font-weight: bold;
            font-size: 12px;
        }
        .monthly-table td {
            border: 1px solid #ddd;
            padding: 6px 8px;
            text-align: center;
            font-size: 11px;
        }
        .month-header {
            background: #e9ecef;
            font-weight: bold;
        }
        .paid-amount {
            color: #28a745;
            font-weight: bold;
        }
        .unpaid-amount {
            color: #dc3545;
            font-weight: bold;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            font-size: 11px;
            color: #666;
            border-top: 2px solid #4472C4;
            padding-top: 15px;
        }
        .page-break {
            page-break-after: always;
        }
        .status-badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: bold;
        }
        .status-active {
            background: #d4edda;
            color: #155724;
        }
        .status-completed {
            background: #cce5ff;
            color: #004085;
        }
        .status-cancelled {
            background: #f8d7da;
            color: #721c24;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>📊 របាយការណ៍ប្រចាំឆ្នាំ {{ $year }}</h1>
        <div class="subtitle">ប្រព័ន្ធតាមដានការទិញដី</div>
        <div class="meta">បង្កើតដោយ៖ {{ $exported_by }} | កាលបរិច្ឆេទ៖ {{ $exported_at }}</div>
    </div>

    <div class="summary-section">
        <div class="summary-title">🎯 សង្ខេបទូទៅ</div>
        <div class="summary-grid">
            <div class="summary-item">
                <span class="summary-label">📋 សរុបកិច្ចសន្យា</span>
                <span class="summary-value">{{ count($contracts) }}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">💰 តម្លៃសរុប</span>
                <span class="summary-value">${{ number_format($summary['total_amount'], 2) }}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">✅ បានបង់</span>
                <span class="summary-value paid-amount">${{ number_format($summary['paid_amount'] ?? 0, 2) }}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">❌ មិនទាន់បង់</span>
                <span class="summary-value unpaid-amount">${{ number_format($summary['unpaid_amount'] ?? 0, 2) }}</span>
            </div>
        </div>
    </div>

    <div class="contracts-section">
        <div class="section-title">📑 ព័ត៌មានលម្អិតកិច្ចសន្យា</div>
        
        @foreach($contracts as $contract)
        <div class="contract-card">
            <div class="contract-header">
                🏠 កិច្ចសន្យាលេខ៖ {{ $contract['contract_id'] }}
                <span class="status-badge status-{{ strtolower($contract['status'] ?? 'active') }}">
                    {{ ($contract['status'] ?? 'active') == 'active' ? 'សកម្ម' : (($contract['status'] ?? 'active') == 'completed' ? 'បានបញ្ចប់' : 'បានលុបចោល') }}
                </span>
            </div>
            
            <div class="contract-info">
                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">👤 អ្នកទិញ៖</span>
                        <span class="info-value">{{ $contract['buyer_name'] ?? 'មិនមាន' }}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">🏢 អ្នកលក់៖</span>
                        <span class="info-value">{{ $contract['seller_name'] ?? 'មិនមាន' }}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">🏞️ លេខដី៖</span>
                        <span class="info-value">{{ $contract['plot_number'] ?? 'មិនមាន' }}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">💰 តម្លៃសរុប៖</span>
                        <span class="info-value">${{ number_format($contract['total_amount'], 2) }}</span>
                    </div>
                </div>

                @if(isset($contract['monthly_breakdown']) && count($contract['monthly_breakdown']) > 0)
                <div class="monthly-breakdown">
                    <div class="monthly-title">📅 ការបំបែកតាមខែ</div>
                    <table class="monthly-table">
                        <thead>
                            <tr>
                                <th rowspan="2">ខែ</th>
                                @for($month = 1; $month <= 12; $month++)
                                    <th colspan="2">{{ sprintf('%02d/%s', $month, substr($year, -2)) }}</th>
                                @endfor
                            </tr>
                            <tr>
                                @for($month = 1; $month <= 12; $month++)
                                    <th class="paid-amount">បានបង់</th>
                                    <th class="unpaid-amount">មិនទាន់បង់</th>
                                @endfor
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="month-header">ចំនួនទឹកប្រាក់</td>
                                @for($month = 1; $month <= 12; $month++)
                                    @php
                                        $monthKey = sprintf('%04d-%02d', $year, $month);
                                        $monthData = $contract['monthly_breakdown'][$monthKey] ?? ['paid' => 0, 'unpaid' => 0];
                                    @endphp
                                    <td class="paid-amount">${{ number_format($monthData['paid'], 0) }}</td>
                                    <td class="unpaid-amount">${{ number_format($monthData['unpaid'], 0) }}</td>
                                @endfor
                            </tr>
                        </tbody>
                    </table>
                </div>
                @endif
            </div>
        </div>

        @if($loop->iteration % 2 == 0 && !$loop->last)
        <div class="page-break"></div>
        @endif
        @endforeach
    </div>

    <div class="footer">
        <p><strong>🏢 ប្រព័ន្ធតាមដានការទិញដី ONC</strong></p>
        <p>របាយការណ៍នេះត្រូវបានបង្កើតដោយស្វ័យប្រវត្តិ និងមានសុពលភាពពេញលេញ</p>
        <p>&copy; {{ date('Y') }} - ការទិញដីកម្ពុជា</p>
    </div>
</body>
</html>

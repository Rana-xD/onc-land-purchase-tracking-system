<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Contract Report - {{ $contract['id'] }}</title>
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
            font-family: 'Koh Santepheap', sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
            font-size: 12pt;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
        }
        .title {
            font-size: 24pt;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .subtitle {
            font-size: 14pt;
            margin-bottom: 5px;
        }
        .section {
            margin-bottom: 20px;
        }
        .section-title {
            font-size: 16pt;
            font-weight: bold;
            margin-bottom: 10px;
            border-bottom: 1px solid #999;
            padding-bottom: 5px;
        }
        .info-row {
            margin-bottom: 5px;
        }
        .label {
            font-weight: bold;
            display: inline-block;
            width: 150px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 10pt;
            color: #666;
            border-top: 1px solid #999;
            padding-top: 10px;
        }
        .page-break {
            page-break-after: always;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">Contract Report</div>
        <div class="subtitle">Contract ID: {{ $contract['id'] }}</div>
        <div class="subtitle">Date: {{ $contract['date'] }}</div>
    </div>

    <div class="section">
        <div class="section-title">Contract Information</div>
        <div class="info-row">
            <span class="label">Contract ID:</span> {{ $contract['id'] }}
        </div>
        <div class="info-row">
            <span class="label">Contract Date:</span> {{ $contract['date'] }}
        </div>
        <div class="info-row">
            <span class="label">Status:</span> {{ ucfirst($contract['status']) }}
        </div>
        <div class="info-row">
            <span class="label">Total Amount:</span> ${{ number_format($contract['total_amount'], 2) }}
        </div>
    </div>

    <div class="section">
        <div class="section-title">Buyer Information</div>
        @if(isset($buyers) && count($buyers) > 0)
            @foreach($buyers as $index => $buyer)
                <div style="margin-bottom: 15px; @if($index > 0) border-top: 1px dashed #ccc; padding-top: 15px; @endif">
                    <div class="info-row">
                        <span class="label">Buyer #{{ $index + 1 }}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Name:</span> {{ $buyer['name'] }}
                    </div>
                    <div class="info-row">
                        <span class="label">Phone:</span> {{ $buyer['phone'] ?? 'N/A' }}
                    </div>
                    <div class="info-row">
                        <span class="label">Address:</span> {{ $buyer['address'] ?? 'N/A' }}
                    </div>
                </div>
            @endforeach
        @elseif(isset($buyer))
            <!-- Fallback for backward compatibility -->
            <div class="info-row">
                <span class="label">Name:</span> {{ $buyer['name'] }}
            </div>
            <div class="info-row">
                <span class="label">Phone:</span> {{ $buyer['phone'] ?? 'N/A' }}
            </div>
            <div class="info-row">
                <span class="label">Address:</span> {{ $buyer['address'] ?? 'N/A' }}
            </div>
        @else
            <div class="info-row">
                <span>No buyer information available</span>
            </div>
        @endif
    </div>

    <div class="section">
        <div class="section-title">Seller Information</div>
        @if(isset($sellers) && count($sellers) > 0)
            @foreach($sellers as $index => $seller)
                <div style="margin-bottom: 15px; @if($index > 0) border-top: 1px dashed #ccc; padding-top: 15px; @endif">
                    <div class="info-row">
                        <span class="label">Seller #{{ $index + 1 }}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Name:</span> {{ $seller['name'] }}
                    </div>
                    <div class="info-row">
                        <span class="label">Phone:</span> {{ $seller['phone'] ?? 'N/A' }}
                    </div>
                    <div class="info-row">
                        <span class="label">Address:</span> {{ $seller['address'] ?? 'N/A' }}
                    </div>
                </div>
            @endforeach
        @elseif(isset($seller))
            <!-- Fallback for backward compatibility -->
            <div class="info-row">
                <span class="label">Name:</span> {{ $seller['name'] }}
            </div>
            <div class="info-row">
                <span class="label">Phone:</span> {{ $seller['phone'] ?? 'N/A' }}
            </div>
            <div class="info-row">
                <span class="label">Address:</span> {{ $seller['address'] ?? 'N/A' }}
            </div>
        @else
            <div class="info-row">
                <span>No seller information available</span>
            </div>
        @endif
    </div>

    <div class="section">
        <div class="section-title">Land Information</div>
        @if(isset($lands) && count($lands) > 0)
            @foreach($lands as $index => $land)
                <div style="margin-bottom: 15px; @if($index > 0) border-top: 1px dashed #ccc; padding-top: 15px; @endif">
                    <div class="info-row">
                        <span class="label">Land #{{ $index + 1 }}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Plot Number:</span> {{ $land['plot_number'] }}
                    </div>
                    <div class="info-row">
                        <span class="label">Size:</span> {{ $land['size'] }} m²
                    </div>
                    <div class="info-row">
                        <span class="label">Location:</span> {{ $land['location'] }}
                    </div>
                    <div class="info-row">
                        <span class="label">Price per m²:</span> ${{ number_format($land['price_per_m2'], 2) }}
                    </div>
                    <div class="info-row">
                        <span class="label">Total Price:</span> ${{ number_format($land['total_price'], 2) }}
                    </div>
                </div>
            @endforeach
        @elseif(isset($land))
            <!-- Fallback for backward compatibility -->
            <div class="info-row">
                <span class="label">Plot Number:</span> {{ $land['plot_number'] }}
            </div>
            <div class="info-row">
                <span class="label">Size:</span> {{ $land['size'] }}
            </div>
            <div class="info-row">
                <span class="label">Location:</span> {{ $land['location'] }}
            </div>
        @else
            <div class="info-row">
                <span>No land information available</span>
            </div>
        @endif
    </div>

    <div class="page-break"></div>

    <div class="section">
        <div class="section-title">Payment Schedule</div>
        <table>
            <thead>
                <tr>
                    <th>Step</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Due Date</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                @foreach($payment_steps as $step)
                <tr>
                    <td>{{ $step['step_number'] }}</td>
                    <td>{{ $step['description'] }}</td>
                    <td>${{ number_format($step['amount'], 2) }}</td>
                    <td>{{ $step['due_date'] }}</td>
                    <td>{{ ucfirst($step['status']) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <div class="section">
        <div class="section-title">Documents</div>
        <table>
            <thead>
                <tr>
                    <th>Step</th>
                    <th>Document Type</th>
                    <th>File Name</th>
                    <th>Uploaded At</th>
                </tr>
            </thead>
            <tbody>
                @foreach($payment_steps as $step)
                    @foreach($step['documents'] as $document)
                    <tr>
                        <td>{{ $step['step_number'] }}</td>
                        <td>{{ ucfirst(str_replace('_', ' ', $document['type'])) }}</td>
                        <td>{{ $document['name'] }}</td>
                        <td>{{ $document['uploaded_at'] }}</td>
                    </tr>
                    @endforeach
                @endforeach
            </tbody>
        </table>
    </div>

    <div class="footer">
        <p>Generated by: {{ $exported_by }} | Date: {{ $exported_at }}</p>
        <p>This is an official document of the Land Purchase Tracking System.</p>
    </div>
</body>
</html>

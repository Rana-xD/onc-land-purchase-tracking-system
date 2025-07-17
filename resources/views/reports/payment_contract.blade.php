<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Payment Contract - {{ $contract_id }}</title>
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
        .payment-box {
            border: 2px solid #333;
            padding: 15px;
            margin-top: 20px;
            margin-bottom: 20px;
        }
        .signature-section {
            margin-top: 50px;
            display: flex;
            justify-content: space-between;
        }
        .signature-box {
            width: 45%;
        }
        .signature-line {
            border-top: 1px solid #333;
            margin-top: 50px;
            padding-top: 5px;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 10pt;
            color: #666;
            border-top: 1px solid #999;
            padding-top: 10px;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">Payment Contract</div>
        <div class="subtitle">Contract ID: {{ $contract_id }}</div>
        <div class="subtitle">Payment Step: {{ $payment_step['step_number'] }}</div>
    </div>

    <div class="section">
        <div class="section-title">Contract Information</div>
        <div class="info-row">
            <span class="label">Contract ID:</span> {{ $contract_id }}
        </div>
        <div class="info-row">
            <span class="label">Payment Step:</span> {{ $payment_step['step_number'] }}
        </div>
        <div class="info-row">
            <span class="label">Description:</span> {{ $payment_step['description'] }}
        </div>
    </div>

    <div class="section">
        <div class="section-title">Buyer Information</div>
        <div class="info-row">
            <span class="label">Name:</span> {{ $buyer_name }}
        </div>
        <div class="info-row">
            <span class="label">Phone:</span> {{ $buyer_phone ?? 'N/A' }}
        </div>
        <div class="info-row">
            <span class="label">Address:</span> {{ $buyer_address ?? 'N/A' }}
        </div>
    </div>

    <div class="section">
        <div class="section-title">Seller Information</div>
        <div class="info-row">
            <span class="label">Name:</span> {{ $seller_name }}
        </div>
        <div class="info-row">
            <span class="label">Phone:</span> {{ $seller_phone ?? 'N/A' }}
        </div>
        <div class="info-row">
            <span class="label">Address:</span> {{ $seller_address ?? 'N/A' }}
        </div>
    </div>

    <div class="section">
        <div class="section-title">Land Information</div>
        <div class="info-row">
            <span class="label">Plot Number:</span> {{ $land_info['plot_number'] }}
        </div>
        <div class="info-row">
            <span class="label">Size:</span> {{ $land_info['size'] }}
        </div>
        <div class="info-row">
            <span class="label">Location:</span> {{ $land_info['location'] }}
        </div>
    </div>

    <div class="payment-box">
        <div class="section-title">Payment Details</div>
        <div class="info-row">
            <span class="label">Amount:</span> ${{ number_format($payment_step['amount'], 2) }}
        </div>
        <div class="info-row">
            <span class="label">Due Date:</span> {{ $payment_step['due_date'] }}
        </div>
        <div class="info-row">
            <span class="label">Payment Description:</span> {{ $payment_step['description'] }}
        </div>
    </div>

    <div class="section">
        <p>This payment contract is a legally binding agreement between the buyer and seller for the payment specified above as part of the land purchase agreement referenced by Contract ID {{ $contract_id }}.</p>
        <p>By signing below, both parties acknowledge and agree to the terms of this payment.</p>
    </div>

    <div class="signature-section">
        <div class="signature-box">
            <div class="signature-line">Buyer Signature</div>
            <div>{{ $buyer_name }}</div>
            <div>Date: ___________________</div>
        </div>
        <div class="signature-box">
            <div class="signature-line">Seller Signature</div>
            <div>{{ $seller_name }}</div>
            <div>Date: ___________________</div>
        </div>
    </div>

    <div class="footer">
        <p>Generated by: {{ $generated_by }} | Date: {{ $generated_at }}</p>
        <p>This is an official payment contract document of the Land Purchase Tracking System.</p>
    </div>
</body>
</html>

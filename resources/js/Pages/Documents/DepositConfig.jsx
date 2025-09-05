import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import {
    Card,
    Button,
    Typography,
    Steps,
    InputNumber,
    Select,
    message,
    Divider,
    Input,
} from "antd";
import {
    UserOutlined,
    TeamOutlined,
    EnvironmentOutlined,
    DollarOutlined,
    FileOutlined,
} from "@ant-design/icons";
import AdminLayout from "@/Layouts/AdminLayout";
import axios from "axios";

const { Title, Text } = Typography;
const { Option } = Select;

export default function DepositConfig({ document }) {
    const [loading, setLoading] = useState(false);
    const [depositAmount, setDepositAmount] = useState(
        document.deposit_amount || 0,
    );
    const [depositMonths, setDepositMonths] = useState(
        document.deposit_months || 3,
    );
    const [periodType, setPeriodType] = useState("preset"); // 'preset' or 'custom'
    const [customDays, setCustomDays] = useState("");

    const handleGenerate = async () => {
        if (!depositAmount) {
            message.error("សូមបញ្ចូលចំនួនប្រាក់កក់");
            return;
        }

        let finalDepositMonths = depositMonths;

        // Handle custom days input
        if (periodType === "custom") {
            if (!customDays || customDays.trim() === "") {
                message.error("សូមបញ្ចូលរយៈពេល");
                return;
            }
            // Store as string with user input
            finalDepositMonths = customDays;
        } else if (!depositMonths) {
            message.error("សូមជ្រើសរើសរយៈពេលកក់ប្រាក់");
            return;
        } else {
            // Convert numeric months to descriptive string
            if (depositMonths === 0.25) {
                finalDepositMonths = "1 សប្តាហ៍";
            } else if (depositMonths === 0.5) {
                finalDepositMonths = "2 សប្តាហ៍";
            } else if (depositMonths === 0.75) {
                finalDepositMonths = "3 សប្តាហ៍";
            } else if (depositMonths === 1) {
                finalDepositMonths = "4 សប្តាហ៍";
            } else {
                finalDepositMonths = `${depositMonths} ខែ`;
            }
        }

        setLoading(true);

        try {
            // Use the new API route structure
            const apiPrefix = "deposit-contracts"; // This component is only for deposit contracts

            // First save deposit config
            await axios.post(
                `/api/${apiPrefix}/${document.id}/deposit-config`,
                {
                    deposit_amount: depositAmount,
                    deposit_months: finalDepositMonths,
                    custom_days: periodType === "custom" ? customDays : null,
                },
            );

            // Redirect to success page
            window.location.href = route("deposit-contracts.success", {
                id: document.id,
            });
        } catch (error) {
            console.error("Error generating document:", error);

            if (
                error.response &&
                error.response.data &&
                error.response.data.error
            ) {
                message.error(error.response.data.error);
            } else {
                message.error("មានបញ្ហាក្នុងការបង្កើតកិច្ចសន្យា");
            }
        } finally {
            setLoading(false);
        }
    };

    // Determine current step
    const currentStep = 3; // Fourth step (0-indexed)

    const steps = [
        {
            title: "ជ្រើសរើសអ្នកទិញ",
            icon: <UserOutlined />,
        },
        {
            title: "ជ្រើសរើសអ្នកលក់",
            icon: <TeamOutlined />,
        },
        {
            title: "ជ្រើសរើសដី និងកំណត់តម្លៃ",
            icon: <EnvironmentOutlined />,
        },
        {
            title: "កំណត់ការកក់ប្រាក់",
            icon: <DollarOutlined />,
        },
        {
            title: "បង្កើតកិច្ចសន្យា",
            icon: <FileOutlined />,
        },
    ];

    return (
        <AdminLayout>
            <Head title="កំណត់ការកក់ប្រាក់" />

            <div className="container mx-auto py-6">
                <Card className="mb-6">
                    <Steps
                        current={currentStep}
                        items={steps}
                        responsive={true}
                        className="site-navigation-steps"
                        size="small"
                    />
                </Card>

                <Card>
                    <Title level={3} className="mb-6">
                        កំណត់ការកក់ប្រាក់
                    </Title>

                    <div className="mb-6">
                        <Text strong>
                            តម្លៃដីសរុប: $
                            {parseFloat(
                                document.total_land_price,
                            ).toLocaleString()}
                        </Text>
                    </div>

                    <Divider />

                    <div className="max-w-md mx-auto">
                        <div className="mb-6">
                            <div className="mb-2">
                                <Text strong>
                                    ចំនួនប្រាក់កក់ (Deposit Amount){" "}
                                    <span style={{ color: "red" }}>*</span>
                                </Text>
                            </div>
                            <InputNumber
                                style={{ width: "100%" }}
                                min={0}
                                max={document.total_land_price}
                                precision={2}
                                prefix="$"
                                value={depositAmount}
                                onChange={setDepositAmount}
                                placeholder="បញ្ចូលចំនួនប្រាក់កក់"
                            />
                        </div>

                        <div className="mb-6">
                            <div className="mb-2">
                                <Text strong>
                                    រយៈពេលកក់ប្រាក់ (Deposit Period){" "}
                                    <span style={{ color: "red" }}>*</span>
                                </Text>
                            </div>
                            <div className="mb-3">
                                <Select
                                    style={{ width: "100%" }}
                                    value={periodType}
                                    onChange={(value) => {
                                        setPeriodType(value);
                                        if (value === "preset") {
                                            setCustomDays("");
                                        } else {
                                            setDepositMonths(null);
                                        }
                                    }}
                                    placeholder="ជ្រើសរើសប្រភេទរយៈពេល"
                                >
                                    <Option value="preset">
                                        ជ្រើសរើសពីជម្រើសដែលមាន
                                    </Option>
                                    <Option value="custom">
                                        បញ្ចូលដោយខ្លួនឯង
                                    </Option>
                                </Select>
                            </div>

                            {periodType === "preset" && (
                                <Select
                                    style={{ width: "100%" }}
                                    value={depositMonths}
                                    onChange={setDepositMonths}
                                    placeholder="ជ្រើសរើសរយៈពេល"
                                >
                                    <Option value={0.25}>1 សប្តាហ៍</Option>
                                    <Option value={0.5}>2 សប្តាហ៍</Option>
                                    <Option value={0.75}>3 សប្តាហ៍</Option>
                                    <Option value={1}>4 សប្តាហ៍</Option>
                                    <Option value={2}>2 ខែ</Option>
                                    <Option value={3}>3 ខែ</Option>
                                    <Option value={4}>4 ខែ</Option>
                                    <Option value={5}>5 ខែ</Option>
                                    <Option value={6}>6 ខែ</Option>
                                </Select>
                            )}

                            {periodType === "custom" && (
                                <div>
                                    <Input
                                        style={{ width: "100%" }}
                                        value={customDays}
                                        onChange={(e) => setCustomDays(e.target.value)}
                                        placeholder="បញ្ចូលរយៈពេល (ឧ. 20 ថ្ងៃ, 45 ថ្ងៃ)"
                                    />
                                    <Text
                                        type="secondary"
                                        style={{
                                            fontSize: "12px",
                                            display: "block",
                                            marginTop: "4px",
                                        }}
                                    >
                                        ឧទាហរណ៍: 20 ថ្ងៃ, 2 សប្តាហ៍, 1.5 ខែ
                                    </Text>
                                </div>
                            )}
                        </div>
                    </div>

                    <Divider />

                    <div className="flex justify-between mt-6">
                        <Button
                            href={route("deposit-contracts.select-lands", {
                                id: document.id,
                            })}
                        >
                            ត្រឡប់
                        </Button>
                        <Button
                            type="primary"
                            onClick={handleGenerate}
                            loading={loading}
                            disabled={
                                !depositAmount ||
                                (periodType === "preset" && !depositMonths) ||
                                (periodType === "custom" && (!customDays || customDays.trim() === ""))
                            }
                        >
                            បង្កើតកិច្ចសន្យា
                        </Button>
                    </div>
                </Card>
            </div>
        </AdminLayout>
    );
}

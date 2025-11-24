import React, { Component, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * Error Boundary component để bắt lỗi render trong React component tree
 * Sử dụng class component vì React chưa hỗ trợ Error Boundary cho functional component
 */
export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null
        };
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error
        };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Log error để debug
        console.error("ErrorBoundary caught an error:", error, errorInfo);
        
        // Gọi callback nếu có
        this.props.onError?.(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // Nếu có custom fallback, sử dụng nó
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default fallback UI
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                    <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            Đã xảy ra lỗi
                        </h2>
                        <p className="text-gray-600 mb-6">
                            {this.state.error?.message || "Có lỗi không mong muốn xảy ra. Vui lòng thử lại sau."}
                        </p>
                        <button
                            onClick={() => {
                                this.setState({ hasError: false, error: null });
                                window.location.href = "/";
                            }}
                            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                        >
                            Về trang chủ
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}


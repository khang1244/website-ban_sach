import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useNavigate } from "react-router-dom";

const PayPalButton = ({
  amount, // Số tiền cần thanh toán bằng VND
  submitForm, // Hàm để gọi khi thanh toán thành công
  termIsAccepted, // Biến kiểm tra điều khoản đã được chấp nhận hay chưa
}) => {
  const vndToUsdRate = 0.000042; // Tỷ giá chuyển đổi từ VND sang USD
  const amountInVND = amount; // Số lượng tiền bằng VND
  const amountInUSD = (amountInVND * vndToUsdRate).toFixed(2); // Tiền khi quy đổi sang USD, làm tròn đến 2 chữ số thập phân
  const router = useNavigate();
  return (
    // Cung cấp PayPal Script Provider với clientId và cấu hình
    <PayPalScriptProvider
      options={{
        clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID, // Lấy từ biến môi trường, khóa bí mật
        currency: "USD", // Sử dụng USD cho PayPal
      }}
    >
      // Cấu hình nút PayPal
      <PayPalButtons
        createOrder={(data, actions) => {
          if (!termIsAccepted) {
            return Promise.reject(new Error("Terms not accepted"));
          }
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                amount: {
                  currency_code: "USD", // Sử dụng USD
                  value: amountInUSD, // Số tiền sau khi quy đổi sang USD
                },
              },
            ],
          });
        }}
        onApprove={(data, actions) => {
          if (!actions.order) {
            console.error("Order is undefined.");
            return Promise.reject(new Error("Order is undefined."));
          }
          return actions.order.capture().then((details) => {
            console.log(
              "Transaction completed by " +
                (details.payer?.name?.given_name || "Unknown")
            );

            submitForm(); // Gọi hàm submitForm để xử lý đặt hàng

            router.push(`/xacnhandonhang`); // Chuyển hướng sau khi thanh toán thành công
          });
        }}
        onError={(err) => {
          console.error("PayPal Checkout Error:", err);
          return Promise.reject(new Error("Payment failed. Please try again."));
        }}
      />
    </PayPalScriptProvider>
  );
};

export default PayPalButton;

import { http } from "./httpConfig";

const paymentService = {
    getPayment: ()=> {
        return http.get('/customer/payment-methods');
    },
    verifyPayment: (data)=> {
        return http.post('/booking/verify-payment', data);
    }
}

export default paymentService
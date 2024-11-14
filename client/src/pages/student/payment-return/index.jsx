import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { captureAndFinalizeService } from '@/services';
import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const PaypalPaymentReturnPage = () => {

    const location = useLocation();

    const params = new URLSearchParams(location.search);
    const paymentId = params.get('paymentId');
    const payerId = params.get('PayerID');
     useEffect(()=>{
        if(paymentId&&payerId){
            const capturePayment = async ()=>{
                let orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));
                const response = await captureAndFinalizeService( paymentId, payerId, orderId)
                if(response.data.success){
                    window.location.href = "/student-courses"
                }
            }
            capturePayment()
        }
     },[paymentId, payerId])

  return (
    <Card>
        <CardHeader>
        <CardTitle>
            Processing payment... please wait
        </CardTitle>
        </CardHeader>
    </Card>
  )
}

export default PaypalPaymentReturnPage

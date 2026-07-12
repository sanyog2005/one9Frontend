import React, { useEffect, useState } from 'react';

const PaytmCheckout = ({ txnToken, orderId, amount, mid, onClose }) => {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    if (window.Paytm && window.Paytm.CheckoutJS) {
      setIsScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://securegw-stage.paytm.in/merchantpgpui/checkoutjs/merchants/${mid}.js`;
    script.crossOrigin = 'anonymous';
    script.onload = () => setIsScriptLoaded(true);
    document.body.appendChild(script);
  }, [mid]);

  useEffect(() => {
    if (isScriptLoaded && txnToken) {
      const config = {
        root: '',
        flow: 'DEFAULT',
        data: {
          orderId: orderId,
          token: txnToken,
          tokenType: 'TXN_TOKEN',
          amount: amount
        },
        handler: {
          notifyMerchant: (eventName, data) => {
            console.log('notifyMerchant handler function called', eventName, data);
          },
          transactionStatus: (data) => {
            console.log('transaction completed', data);
            if (data.STATUS === 'TXN_SUCCESS') {
              window.location.href = `/success?payment_status=success`;
            } else {
              window.location.href = `/failed?payment_status=failed`;
            }
            onClose && onClose();
          }
        }
      };

      if (window.Paytm && window.Paytm.CheckoutJS) {
        window.Paytm.CheckoutJS.init(config).then(() => {
          window.Paytm.CheckoutJS.invoke();
        }).catch(error => {
          console.log("error => ", error);
        });
      }
    }
  }, [isScriptLoaded, txnToken, orderId, amount, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-[2rem] flex flex-col items-center justify-center shadow-2xl">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-black font-bold uppercase tracking-widest">Initializing Secure Payment...</p>
      </div>
    </div>
  );
};

export default PaytmCheckout;

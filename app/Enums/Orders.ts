// app/Enums/Orders.ts
export enum OrderStatuses {
    PENDING = 'pending',
    PREPARING = 'preparing',
    IN_DELIVERY = 'in_delivery',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled'
  }
  
  export enum PaymentMethods {
    MOBILE_MONEY = 'mobile_money',
    CASH = 'cash'
  }
  
  export enum PaymentStatuses {
    PENDING = 'pending',
    PAID = 'paid',
    FAILED = 'failed'
  }
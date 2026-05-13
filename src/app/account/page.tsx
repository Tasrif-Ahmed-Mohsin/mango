"use client";
import React, { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
    } else if (status === "authenticated") {
      fetchOrders();
    }
  }, [status, router]);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/user/orders");
      const data = await res.json();
      if (res.ok) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FBF7F0]">
        <p className="text-xl font-medium text-[#0A4027]">Loading your account...</p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="container mx-auto px-6 py-16 max-w-5xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4 border-b border-[#EAE3D5] pb-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#0A4027] tracking-tight font-serif mb-2">My Account</h1>
          <p className="text-[#3A5333] text-lg font-medium">Welcome back, {session.user?.name}</p>
        </div>
        <button
          onClick={() => signOut()}
          className="bg-white border border-[#EAE3D5] text-[#B04132] px-6 py-2.5 rounded-full font-bold shadow-sm hover:bg-gray-50 transition-colors"
        >
          Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-1">
          <div className="bg-white rounded-3xl p-8 border border-[#EAE3D5] shadow-sm flex flex-col items-center text-center">
            {session.user?.image ? (
              <img src={session.user.image} alt="Profile" className="w-24 h-24 rounded-full mb-4 border-4 border-[#FAD65F]" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-[#FAD65F] text-[#0A4027] flex items-center justify-center text-3xl font-bold mb-4">
                {session.user?.name?.charAt(0)}
              </div>
            )}
            <h2 className="text-xl font-bold text-[#0A4027] mb-1">{session.user?.name}</h2>
            <p className="text-sm text-[#81917C] font-medium">{session.user?.email}</p>
          </div>
        </div>

        <div className="col-span-1 md:col-span-2">
          <div className="bg-white rounded-3xl p-8 border border-[#EAE3D5] shadow-sm">
            <h2 className="text-2xl font-bold text-[#0A4027] mb-6 font-serif">Order History</h2>
            
            {orders.length === 0 ? (
              <div className="text-center py-10 bg-[#FAF7F0] rounded-2xl border border-dashed border-[#EAE3D5]">
                <p className="text-[#3A5333] text-lg font-medium mb-4">You haven't placed any orders yet.</p>
                <Link href="/#shop" className="bg-[#F0A500] hover:bg-[#D26900] text-white px-6 py-3 rounded-full font-bold shadow-md transition-colors inline-block">
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order._id} className="border border-[#EAE3D5] rounded-2xl p-5 hover:border-[#FAD65F] transition-colors">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-2 border-b border-gray-100 pb-3">
                      <div>
                        <p className="text-xs text-[#81917C] font-bold uppercase tracking-widest mb-1">Order #{order.orderId}</p>
                        <p className="text-sm text-[#3A5333] font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex gap-3 items-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {order.status}
                        </span>
                        <span className="font-bold text-[#0A4027]">৳{order.totals?.total?.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {order.items.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <span className="text-[#3A5333]"><span className="font-semibold">{item.quantity}x</span> {item.name}</span>
                          <span className="text-[#81917C] font-medium">৳{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

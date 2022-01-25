import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req){
    // 如果用户已经登陆，那么此token将有值
    const token = await getToken({
        req, 
        secret: process.env.JWT_SECRET
    });
    const {pathname} = req.nextUrl;

    // 如果符合下列情况，则允许请求通过
    // 1. 它是next_auth session和provider fetching的请求
    // 2. 此token有值
    if (pathname.includes("/api/auth") || token){
        return NextResponse.next();
    }

    // 如何这些请求没有token并且正在访问受保护的路由，则重定向它们
    if (!token && pathname !== "/login"){
        return NextResponse.redirect("/login");
    }

}
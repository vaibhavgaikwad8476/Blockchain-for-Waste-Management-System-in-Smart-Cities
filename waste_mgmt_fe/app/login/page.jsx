"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { authApi } from "../api";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useLocalStorage } from "../hooks";

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "This field has to be filled." })
    .email("This is not a valid email."),
  password: z
    .string()
    .min(8, { message: "Password should be atleast 8 characters" }),
});

const LoginForm = () => {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });
  const [loading, setLoading] = useState({ isLoginLoading: false });
  const [userDetails, setUserDetails] = useLocalStorage("userDetails", null);
  const [token, setToken] = useLocalStorage("token", null);
  const onSubmit = async (values) => {
    try {
      setLoading({ ...loading, isLoginLoading: true });
      const payload = {
        email: values.email,
        password: values.password,
      };
      const response = await authApi.login(payload);
      if (response.status === 201) {
        form.reset();
        router.push("/home");
        setToken(response.data.access_token);
        setUserDetails(JSON.stringify(response.data.userDetails));
      }
      setLoading({ ...loading, isLoginLoading: false });
    } catch (error) {
      toast({
        variant: "destructive",
        description: error.response.data.message,
      });
    } finally {
      setLoading({ ...loading, isLoginLoading: false });
    }
  };

  return (
    <main className="h-screen pt-10">
      <h1 className="text-center font-extrabold text-2xl">
        SMART WASTE MANAGEMENT
      </h1>
      <Card className="w-[85%] md:w-[30%] mt-4 mx-auto shadow-lg border-0 bg-slate-100">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-2"
              id="login_form"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        className="border-0 outline-none"
                        placeholder="Eg. email@gmail.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        className="border-0 outline-none"
                        placeholder="********"
                        {...field}
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href={"/register"} className="text-sm">
            New? Click here to register
          </Link>
          <Button
            type="submit"
            form="login_form"
            disabled={loading.isLoginLoading}
          >
            {loading.isLoginLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Login
          </Button>
        </CardFooter>
        <CardFooter className="flex justify-between">
          <Link href={"/"} className="text-sm">
            Back to Homepage
          </Link>
        </CardFooter>
      </Card>
      <Image
        style={{
          left: "calc(50% - 650px)",
          opacity: 0.7,
        }}
        src={"/home/login2.jpg"}
        alt="login image"
        className="mx-auto absolute -z-10 bottom-1 "
        width={1300}
        height={10}
        priority
      />
    </main>
  );
};

export default LoginForm;

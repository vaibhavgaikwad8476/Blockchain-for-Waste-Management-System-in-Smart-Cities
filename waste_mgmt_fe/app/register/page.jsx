"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authApi } from "../api";
import dynamic from "next/dynamic";

const LocationPickerDialog = dynamic(
  () => import("@/components/custom/LocationPickerDialog"),
  {
    ssr: false,
  }
);

const formSchema = z
  .object({
    username: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    email: z
      .string()
      .min(1, { message: "Email is Required" })
      .email("This is not a valid email."),
    password: z
      .string()
      .min(8, { message: "Password should be atleast 8 characters" }),
    confirmedPassword: z
      .string()
      .min(8, { message: "Password should be at least 8 characters" }),

    type: z.string().min(8, { message: "Type is required" }),

    phoneNumber: z
      .string()
      .length(10, "Enter a valid phone number")
      .regex(/^\d{10}$/, "Enter a valid phone number"),

    address: z.string().min(3, {
      message: "Address must be at least 3 characters.",
    }),
  })
  .refine((data) => data.password === data.confirmedPassword, {
    message: "Passwords don't match",
    path: ["confirmedPassword"], // path of error
  });

const RegisterForm = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState({ isSignupLoading: false });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmedPassword: "",
      type: "",
      address: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      if (!location)
        return toast({
          variant: "destructive",
          description: "Please Choose your location",
        });
      setLoading({ ...loading, isSignupLoading: true });
      const payload = {
        name: values.username,
        email: values.email,
        password: values.password,
        phoneNumber: values.phoneNumber,
        address: values.address,
        location: [position.lng, position.lat],
        type: values.type,
      };
      const response = await authApi.signup(payload);
      if (response.status === 201) {
        toast({
          description: "Registration Successfull Login to continue",
        });
        form.reset();
        setPosition(null);
        router.push("/login");
      }
      setLoading({ ...loading, isSignupLoading: false });
    } catch (error) {
      toast({
        variant: "destructive",
        description: error.response.data.message,
      });
    } finally {
      setLoading({ ...loading, isSignupLoading: false });
    }
  };

  return (
    <main className="pt-10 h-screen">
      <h1 className="text-center font-extrabold text-2xl">
        SMART WASTE MANAGEMENT
      </h1>
      <Card className="w-[85%] md:w-[30%] mx-autom mt-4 mx-auto shadow-lg bg-slate-100">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>Register to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid grid-cols-2 grid-flow-row gap-3"
              id="register_form"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        className="outline-none"
                        placeholder="Eg. Rahul"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                className="col-span-1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        className="outline-none"
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
                        className="outline-none"
                        placeholder="********"
                        {...field}
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmedPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        className="outline-none"
                        placeholder="********"
                        {...field}
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Type</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        {...field}
                        className="outline-none "
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select User Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DOMESTIC">Domestic</SelectItem>
                          <SelectItem value="COMMERCIAL">Commercial</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        className="outline-none"
                        placeholder="eg. 1234567890"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Select Location</FormLabel>
                    <FormControl>
                      <LocationPickerDialog onLocationSelect={setPosition} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Your Address</FormLabel>
                    <FormControl>
                      <Input
                        className="outline-none"
                        placeholder="eg. opp to xyz shop, abc road"
                        {...field}
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
          <Link href={"/login"} className="text-sm">
            Already have an account? Click here to login
          </Link>
          <Button
            type="submit"
            form="register_form"
            disabled={loading.isSignupLoading}
          >
            {loading.isSignupLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Register
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

export default RegisterForm;

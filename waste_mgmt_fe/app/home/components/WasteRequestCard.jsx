import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import React from "react";
import Link from "next/link";
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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { wasteCollectionApi, wasteTypesApi } from "@/app/api";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useLocalStorage } from "@/app/hooks";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  collectionDate: z.string().min(1, {
    message: "Collection Date is required",
  }),

  wasteTypeId: z.string().min(1, {
    message: "Waste Type is required",
  }),
  amount: z
    .string()
    .transform((value) => parseFloat(value)) // Transform the string to a number
    .refine((value) => !isNaN(value), { message: "Must be a valid number" }) // Ensure the result is a number
    .refine((value) => value >= 0, { message: "Value must be 0 or greater" }) // Check for minimum value
    .refine((value) => value <= 100, { message: "Value must be 100 or less" }),
});
const WasteRequestCard = ({
  fetchRecentRequests,
  paginationConfig,
  userId,
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState({
    isWasteTypesLoading: false,
    isWasteCollectionLoading: false,
  });
  const [userDetails] = useLocalStorage("userDetails");
  const [allWasteTypes, setAllWasteTypes] = useState([]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      collectionDate: "",
      wasteTypeId: "",
      amount: "",
    },
  });

  useEffect(() => {
    getAllWasteTypes();
  }, []);

  const onSubmit = async (values) => {
    const payload = {
      ...values,
      collectionDate: new Date(values.collectionDate).toISOString(),
      amount: values.amount,
      status: "PENDING",
      userId: JSON.parse(userDetails).id,
    };
    try {
      setLoading({ ...loading, isWasteCollectionLoading: true });
      const response = await wasteCollectionApi.createWasteCollection(payload);
      if (response.status === 201) {
        toast({
          description: "Request Created!",
        });
        form.reset();
        fetchRecentRequests(
          paginationConfig.page,
          paginationConfig.limit,
          userId
        );
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: error.response.data.message,
      });
      setLoading({ ...loading, isWasteCollectionLoading: false });
    } finally {
      setLoading({ ...loading, isWasteCollectionLoading: false });
    }
  };

  const getAllWasteTypes = async () => {
    try {
      setLoading({ ...loading, isWasteTypesLoading: true });
      const response = await wasteTypesApi.getAllWasteTypes();
      setAllWasteTypes(response.data);
    } catch (error) {
      toast({
        variant: "destructive",
        description: error.response.data.message,
      });
      setLoading({ ...loading, isWasteTypesLoading: false });
    } finally {
      setLoading({ ...loading, isWasteTypesLoading: false });
    }
  };

  return (
    <div>
      <Card className="w-[85%] md:w-[50%] mx-autom mt-4 mx-auto shadow-lg bg-slate-100">
        <CardHeader>
          <CardTitle>Create Waste Collection Order</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form} onSubmit={form.handleSubmit(onSubmit)}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid grid-cols-2 grid-flow-row gap-3"
              id="waste_request_form"
            >
              <FormField
                control={form.control}
                name="collectionDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Collection Date Time</FormLabel>
                    <FormControl>
                      <Input
                        max={new Date()}
                        type="datetime-local"
                        className="outline-none"
                        placeholder="Enter Collection Date"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Garbage volume in Dustbin (%)</FormLabel>
                    <FormControl>
                      <Input
                        max={100}
                        type="number"
                        className="outline-none"
                        placeholder="Enter Garbage volume in Dustbin (%)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="wasteTypeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Waste Type</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        {...field}
                        className="outline-none "
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Waste Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {allWasteTypes.map((type) => {
                            return (
                              <SelectItem value={type.id} key={type.id}>
                                {type.name}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            type="submit"
            form="waste_request_form"
            disabled={
              loading.isWasteTypesLoading || loading.isWasteCollectionLoading
            }
          >
            {loading.isWasteCollectionLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Submit
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default WasteRequestCard;

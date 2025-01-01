"use client";

import React, {
  use,
  useActionState,
  useEffect,
  useOptimistic,
  useTransition,
} from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import * as z from "zod";
import { eventDefaultValues } from "@/constants";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/navigation";
import { eventFormSchema } from "@/lib/validator";
import { Checkbox } from "../ui/checkbox";
import _ from "lodash";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import toast from "react-hot-toast";
import { creteEventService } from "@/services/eventService";
import { getAllCategory } from "@/redux/slices/categorySlice";
import { AppDispatch } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Loader2 } from "lucide-react";
import { addNewCategoryService } from "@/services/categoryService";

const EventCreateForm = () => {
  const [loader, setLoader] = useState(false);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [openCatDialog, setOpenCatDialog] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [fileImages, setFileImages] = useState<File[]>([]);
  const [fileImageError, setFileImageError] = useState("");

  const categories = useSelector(
    (state: any) => state.categoryReducer.categories
  );

  const [optimisticName, setOptimisticName] = useOptimistic("abc");
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    getCategoryList();
  }, [dispatch]);

  const getCategoryList = async () => {
    await dispatch(getAllCategory());
  };

  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: eventDefaultValues,
  });

  async function onSubmit(values: z.infer<typeof eventFormSchema>) {
    if (fileImages.length > 0) {
      startTransition(async () => {
        try {
          const {
            title,
            description,
            location,
            imageUrl,
            startDateTime,
            endDateTime,
            categoryId,
            price,
            isFree,
          } = values;
          const formData = new FormData();
          formData.append("title", title);
          formData.append("description", description);
          formData.append("location", location);
          formData.append("startDateTime", startDateTime.toISOString());
          formData.append("endDateTime", endDateTime.toISOString());
          formData.append("price", price);
          formData.append("isFree", String(isFree));
          formData.append("category", categoryId);
          formData.append("organizer", "676bdeeac14f1e743a3a6ae1");
          fileImages.forEach((file) => {
            formData.append("imageUrl", file);
          });
          const response: any = await creteEventService(formData);
          if (response.success === true) {
            toast.success(response.message);
            router.push("/login");
          } else {
            toast.success(response.error);
          }
        } catch (error: any) {
          setLoader(false);
          toast.error(error.message.message);
        }
      });
    } else {
      setFileImageError("Please upload atleas one event image");
    }
  }

  const categoryDialog = () => {
    const [error, submitAction, isPending] = useActionState(
      async (_previousState: any, formData: FormData) => {
        try {
          const catName = await formData.get("name");
          if (!catName) {
            return toast.error("Please add category..!");
          }
          const body = {
            name: catName,
          };
          const response: any = await addNewCategoryService(body);
          if (response.success) {
            toast.success("Category successfully added");
            await getCategoryList();
            setOpenCatDialog(false);
          }
        } catch (error: any) {
          toast.error(error.message.message);
        }
      },
      null
    );

    return (
      <Dialog open={openCatDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <form action={submitAction}>
            <div className="p-4 pt-0">
              <div className="">
                <Label htmlFor="name" className="text-right">
                  Category Name
                </Label>
                <Input
                  placeholder="Category"
                  name="name"
                  id="name"
                  className="mt-2"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={() => setOpenCatDialog(false)}
                type="button"
                variant="secondary"
              >
                Close
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="animate-spin" />}
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileImageError("");
      const newImages = [...images];
      newImages[index] = URL.createObjectURL(file);
      setImages(newImages);
      const newFileImages = [...fileImages];
      newFileImages[index] = file;
      setFileImages(newFileImages);
    }
  };

  const handleDeleteImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    const newFileImages = fileImages.filter((_, i) => i !== index);
    setFileImages(newFileImages);
  };

  console.log("newImages>>>>>>>>>>>>.", fileImages);

  return (
    <div className="gap-4 w-full flex ">
      <Card className="w-full  mt-8 mb-8 ml-3">
        <CardHeader>
          <CardTitle>Event Images</CardTitle>
          <CardDescription className="text-sm font-medium text-destructive">
            {fileImageError && fileImageError}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className=" grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-2 h-fit">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative h-40 w-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden"
              >
                <img
                  src={image}
                  alt={`Uploaded ${index}`}
                  className="object-cover w-full h-full"
                />
                <button
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                  onClick={() => handleDeleteImage(index)}
                >
                  ✕
                </button>
              </div>
            ))}

            <div className="relative h-40 w-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
              <label
                htmlFor={`upload-${images.length}`}
                className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
              >
                <span className="text-2xl text-gray-500">+</span>
              </label>
              <input
                id={`upload-${images.length}`}
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, images.length)}
                className="hidden"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="w-[70%] h-fit flex items-center mt-8 mb-8 mr-3">
        <Card className="w-[1000px]">
          <CardHeader>
            <CardTitle>Events</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-5"
              >
                <div className="flex flex-col gap-5 md:flex-row">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Category</FormLabel>
                        <div className="flex items-center gap-2">
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Category" />
                              </SelectTrigger>
                              <SelectContent>
                                {_.map(categories, (category, index) => (
                                  <SelectItem
                                    key={index}
                                    value={_.get(category, "_id", "")}
                                  >
                                    {_.get(category, "name", "")}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <Button
                            onClick={() => setOpenCatDialog(true)}
                            className="text-sm"
                            type="button"
                          >
                            Add Category
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex flex-col gap-5 md:flex-row">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Description</FormLabel>
                        <FormControl className="h-32">
                          <Textarea placeholder="Description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex flex-col gap-5 md:flex-row">
                  <FormField
                    control={form.control}
                    name="startDateTime"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <FormControl>
                            <div className="relative w-full">
                              <DatePicker
                                selected={field.value}
                                onChange={(date: Date | null) =>
                                  field.onChange(date)
                                }
                                showTimeSelect
                                timeInputLabel="Time:"
                                dateFormat="MM/dd/yyyy h:mm aa"
                                wrapperClassName="w-full"
                                className="w-full h-10 px-3 py-2 border rounded-md border-input bg-background text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                              />
                            </div>
                          </FormControl>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDateTime"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <div className="relative w-full">
                            <DatePicker
                              selected={field.value}
                              onChange={(date: Date | null) =>
                                field.onChange(date)
                              }
                              showTimeSelect
                              timeInputLabel="Time:"
                              dateFormat="MM/dd/yyyy h:mm aa"
                              wrapperClassName="w-full"
                              className="w-full h-10 px-3 py-2 border rounded-md border-input bg-background text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="isFree"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center mt-5">
                          <label
                            htmlFor="isFree"
                            className="whitespace-nowrap pr-3 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Free Ticket
                          </label>
                          <Checkbox
                            onCheckedChange={field.onChange}
                            checked={field.value}
                            id="isFree"
                            className="mr-2 h-5 w-5 border-2 border-primary-500"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col gap-5 md:flex-row">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Location" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Price" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isPending}
                  className="button col-span-2 w-full"
                >
                  {isPending && <Loader2 className="animate-spin" />}
                  Save Event
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        {categoryDialog()}
      </div>
    </div>
  );
};

export default EventCreateForm;

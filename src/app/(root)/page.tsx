"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import hero from "../../../public/assets/images/hero.png";
import EventListCards from "@/components/shared/EventListCards";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { getAllEventData } from "@/redux/slices/eventSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft, ChevronRight, StarIcon } from "lucide-react";

export default function Home() {
  const events = useSelector((state: any) => state.eventReducer.events);

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    getEventList();
  }, [dispatch]);

  const getEventList = () => {
    dispatch(getAllEventData(1, 6));
  };

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-contain py-5 md:py-10">
        <div className="wrapper grid grid-cols-1 gap-5 md:grid-cols-2 2xl:gap-0">
          <div className="flex flex-col justify-center gap-8">
            <h1 className="h1-bold">
              Host, Connect, Celebrate: Your Events, Our Platform!
            </h1>
            <p className="p-regular-20 md:p-regular-24">
              Book and learn helpful tips from 3,168+ mentors in world-class
              companies with our global community.
            </p>
            <Button size="lg" asChild className="button w-full sm:w-fit">
              <Link href="#events">Explore Now</Link>
            </Button>
          </div>

          <Image
            src={hero}
            alt="hero"
            width={1000}
            height={1000}
            className="max-h-[70vh] object-contain object-center 2xl:max-h-[50vh]"
          />
        </div>
      </section>
      <div className="bg-gray-50">
        <section
          id="events"
          className="wrapper my-8 flex flex-col gap-8 md:gap-12 "
        >
          <div className="flex justify-between items-center w-full flex-col gap-5 md:flex-row">
            <h2 className="h2-bold">
              Trust by <br /> Thousands of Events
            </h2>
            <Button variant="outline">See All</Button>
          </div>

          {events.length > 0 ? (
            <div className="flex flex-col items-center gap-10">
              <ul className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-10">
                {events.map((event: any) => {
                  const hidePrice = false;

                  return (
                    <li key={event._id} className="flex justify-center">
                      <EventListCards event={event} hidePrice={hidePrice} />
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <div className="flex-center wrapper min-h-[200px] w-full flex-col gap-3 rounded-[14px] bg-grey-50 py-28 text-center">
              <h3 className="p-bold-20 md:h5-bold">No Record Found</h3>
              <p className="p-regular-14">No Record Found....</p>
            </div>
          )}
        </section>
      </div>

      <section className="py-20 bg-blue-50">
        {" "}
        <div className="container mx-auto text-center px-6">
          {" "}
          <h3 className="text-3xl font-bold mb-8">What Our Users Say</h3>{" "}
          <div className="flex items-center gap-3">
            <Button className="w-[120px]" variant="outline" size="icon">
              <ChevronLeft />
            </Button>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {" "}
              {[
                "Streamlined our school processes!",
                "Amazing features and support!",
                "Highly recommended!",
              ].map((testimonial, index) => (
                <blockquote
                  key={index}
                  className="bg-white p-6 rounded shadow-md flex flex-col items-center"
                >
                  {" "}
                  <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="flex gap-3 my-5 cursor-pointer">
                    <StarIcon /> <StarIcon /> <StarIcon /> <StarIcon />{" "}
                    <StarIcon />
                  </div>
                  <footer className="mt-4 text-sm text-gray-500">
                    {" "}
                    <p className="text-gray-600">
                      To make the site mobile-friendly while maintaining the
                      security of the live site, I required the seller to adhere
                      to a method. He did this and tested the finished webpage.
                      He is someone I would heartily suggest and who I will use
                      again. Thank you CSSFixer.
                    </p>{" "}
                  </footer>{" "}
                </blockquote>
              ))}{" "}
            </div>
            <Button className="w-[120px]" variant="outline" size="icon">
              <ChevronRight />
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

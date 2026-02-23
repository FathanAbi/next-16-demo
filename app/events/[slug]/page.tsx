import { notFound } from 'next/navigation';
import React from 'react'
import Image from 'next/image';
import { json } from 'stream/consumers';
import BookEvent from '@/app/components/BookEvent';
import { IEvent } from '@/database';
import { getSimilarEventsBySlug } from '@/lib/actions/event.actions';
import EventCard from '@/app/components/EventCard';
import { cacheLife } from 'next/cache';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

const EventDetailItem = ({icon, alt, label}: {icon: string, alt: string, label: string;}) => (
  <div className='flex-row-gap-2 items-center'>
    <Image src={icon} alt={alt} width={17} height={17}/>
    <p>{label}</p>
  </div>
)

const EventAgenda = ({agendaItems}: {agendaItems: string[]}) => (
  <div className='agenda'>
    <h2>Agenda</h2>
    <ul>
        {agendaItems.map((item)=> (
          <li key={item}>{item}</li>
        ))}
    </ul>
  </div>
)



const EventTags = ({tags}: {tags: string[]}) => (
  <div className='flex flex-row gap-1.5 flex-wrap'>
    {tags.map((tag)=>(
      <div className='pill' key={tag}>
        {tag}
      </div>
    ))}
  </div>
)


const EventDetailPage = async ({params}: {params: Promise<{slug: string}>}) => {
  'use cache';
  cacheLife('hours')
  const {slug} = await params;

  const request = await fetch(`${BASE_URL}/api/events/${slug}`)
  const { event } = await request.json()

  if(!event) return notFound();

  const bookings = 10;
  const similarEvents: IEvent[] = await getSimilarEventsBySlug(slug);
  return (
    <section id="event">
      <div className='header'>
        <h1>Event Description</h1>
        <p className='mt-2'>{event.description}</p>
      </div>

      <div className='details'>
        <div className='content'>
        <Image src={event.image} alt='Event Banner' height={800} width={800} className='banner'/>

          <section className='flex-col-gap-2'>
            <h2>Overview</h2>
            <p>{event.overview}</p>
          </section>

          <section className='flex-col-gap-2'>
            <h2>Event Details</h2>
            <EventDetailItem icon="/icons/calendar.svg" alt="calendar" label={event.date} />
            <EventDetailItem icon="/icons/clock.svg" alt="clock" label={event.time} />
            <EventDetailItem icon="/icons/pin.svg" alt="pin" label={event.location} />
            <EventDetailItem icon="/icons/mode.svg" alt="mode" label={event.mode} />
            <EventDetailItem icon="/icons/audience.svg" alt="audience" label={event.audience} />
          </section>

          <EventAgenda agendaItems={event.agenda}/>

          <section className='flex-col-gap-2'>
            <h2>Organizer</h2>
            <p>{event.organizer}</p>
          </section>

          <EventTags tags={event.tags} />
        </div>


        <aside className='booking'>
          <div className='signup-card'>
            <h2>Book your spot</h2>
            {bookings > 0 ? (
              <p>Join {bookings} people who already book their spot</p>
            ): (
              <p>Be the first to book your spot</p>
            )}

            <BookEvent eventId={event._id} slug={event.slug}/>
          </div>
        </aside>

      </div>
      
      <div className="w-full flex-col gap-4 pt-20">
                <h2>Similar Events</h2>
                <div className="events">
                    {similarEvents.length > 0 && similarEvents.map((similarEvent: IEvent) => (
                        <EventCard key={similarEvent.title} {...similarEvent} />
                    ))}
                </div>
            </div>
      
    </section>
  )
}

export default EventDetailPage
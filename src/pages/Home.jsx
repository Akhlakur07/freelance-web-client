import React from 'react';
import BannerSlider from '../components/BannerSlider';

const slides = [
  {
    image: "https://i.ibb.co.com/8gBytjr9/pexels-jakubzerdzicki-27861771.jpg",
    alt: "Freelancers collaborating",
    kicker: "TaskForce",
    title: "Where talent meets opportunity",
    subtitle: "Post tasks, hire pros, and get work done—fast.",
    ctaText: "Browse Tasks",
    ctaHref: "/browse-tasks",
  },
  {
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    title: "Post your task in minutes",
    kicker: "TaskForce",
    subtitle: "Describe, budget, and publish. We’ll bring the experts.",
    ctaText: "Add Task",
    ctaHref: "/add-task",
  },
  {
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    title: "Work from anywhere",
    kicker: "TaskForce",
    subtitle: "Flexible gigs for developers, designers, writers, and more.",
    ctaText: "Sign Up",
    ctaHref: "/login",
  },
];

const Home = () => {
    return (
        <div>
            <BannerSlider slides={slides}></BannerSlider>
        </div>
    );
};

export default Home;
import React from "react";
import { Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";
import PublicPage from "./components/PublicPage";
import Login from "./features/auth/Login";
import EventHeader from "./features/event/EventHeader";
import EventList from "./features/event/EventList";
import EventPage from "./features/event/EventPage";
import NewEventForm from "./features/event/form/NewEventForm";
import FilteredEventList from "./features/event/filter/FilteredEventList";
import SortedEventsList from "./features/event/sort/SortedEventsList";
import SearchedEventsList from "./features/event/search/SearchedEventsList";
import VolunteerHeader from "./features/volun/VolunteerHeader";
import VolunteersList from "./features/volun/VolunteersList";
import DashLayout from "./components/DashLayout";
import Welcome from "./features/auth/Welcome";
import SearchedVolunList from "./features/volun/search/SearchedVolunList";
import SortedVolunList from "./features/volun/sort/SortedVolunList";
import SingleVolunteerPage from "./features/volun/SingleVolunteerPage";
import PrefetchEvents from "./features/auth/PrefetchEvents";
import PrefetchVolunteers from "./features/auth/PrefetchVolunteers";
import PersistLogin from "./features/auth/PersistLogin";
import Register from "./features/auth/Register";
import RoleBasedRoute from "./features/auth/RoleBasedRoute";
import EditEvent from "./features/event/form/EditEvent";
import EditVolunteer from "./features/volun/form/EditVolunteer";
import UpdatePassword from "./features/volun/form/UpdatePassword";
import EventStats from "./features/event/EventStats";

import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import ViewportLayout from "./components/ViewportLayout";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index={true} element={<PublicPage />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route element={<PersistLogin />}>
          <Route element={<PrefetchEvents />}>
            <Route path="/dash" element={<DashLayout />}>
              <Route element={<PrefetchVolunteers />}>
                <Route index={true} element={<Welcome />} />
                  <Route path="events" element={<EventHeader />}>
                    <Route index={true} element={<EventList />} />

                    <Route path=":eventId">
                      <Route index element={<EventPage />} />

                      <Route element={<RoleBasedRoute allowedRole={"ADMIN"} />}>
                        <Route path="edit" element={<EditEvent />} />
                        <Route path="stats" element={<EventStats />} />
                      </Route>
                    </Route>

                    <Route path="new" element={<NewEventForm />} />
                    <Route path="filter" element={<FilteredEventList />} />

                    <Route path="sort" element={<SortedEventsList />} />

                    <Route path="search" element={<SearchedEventsList />} />
                  </Route>

                  {/* prefetchVOluns here */}
                  {/* RoleBaseRoute for admin only */}
                  {/* <Route element={<RoleBaseRoute allowedRole={"ADMIN"}/>}> */}
                  <Route path="volunteers" element={<VolunteerHeader />}>
                    <Route element={<RoleBasedRoute allowedRole={"ADMIN"} />}>
                      {/* <Route element={<PrefetchVolunteers/>}> */}
                      <Route index={true} element={<VolunteersList />} />

                      <Route path="search" element={<SearchedVolunList />} />

                      <Route path="sort" element={<SortedVolunList />} />
                      {/* </Route> */}
                    </Route>

                    <Route
                      element={<RoleBasedRoute allowedRole={"VOLUNTEER"} />}
                    >
                      <Route path=":volunId">
                        <Route index={true} element={<SingleVolunteerPage />} />
                        <Route path="edit" element={<EditVolunteer />} />
                        <Route path="pwd" element={<UpdatePassword />} />
                      </Route>
                    </Route>
                  </Route>
                </Route>
              </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default App;

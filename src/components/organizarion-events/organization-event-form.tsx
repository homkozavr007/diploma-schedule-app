"use client";

import { Form, Formik } from "formik";
import * as Yup from "yup";
import FormikTextInput from "../formik/formik-text-input";
import FormikTextArea from "../formik/formik-text-area";
import {
  OrganizationEvent,
  OrganizationEventInput,
} from "../../models/OrganizationEvent";
import { useOrganizationEventsStore } from "../../store/organization-events-store/organization-events-store";
import { format } from "date-fns";
import { useUserPlacesListStore } from "../places/store/user-places-list-store";

export default function OrganizationEventEditForm({
  eventToEdit,
  timeFromCalendar,
  onCompleted,
  onCancel,
  onDelete,
}: {
  eventToEdit: OrganizationEvent | null;
  timeFromCalendar?: { start: Date; end: Date } | null;
  onCompleted: () => void;
  onCancel: () => void;
  onDelete?: (event: OrganizationEvent) => void;
}) {
  console.log("eventToEdit", eventToEdit);
  const addOrganizationEvent = useOrganizationEventsStore(
    (state) => state.addEvent
  );
  const updateOrganizationEvent = useOrganizationEventsStore(
    (state) => state.updateEvent
  );
  const organizationId = useUserPlacesListStore(
    (state) => state.selectedPlaceId
  );
  return (
    <>
      <Formik
        initialValues={{
          title: eventToEdit?.title ?? "",
          start: format(
            eventToEdit?.start ?? timeFromCalendar?.start ?? new Date(),
            "yyyy-MM-dd'T'HH:mm"
          ),
          end: format(
            eventToEdit?.end ?? timeFromCalendar?.end ?? new Date(),
            "yyyy-MM-dd'T'HH:mm"
          ),
          allDay: eventToEdit?.allDay ?? false,
          description: eventToEdit?.description ?? "",
          slotsAvailable: eventToEdit?.slotsAvailable ?? "",
        }}
        enableReinitialize={true}
        onSubmit={async (values, actions) => {
          if (!organizationId) {
            console.error("No organization id");
            onCancel();
            return;
          }
          const eventInput: OrganizationEventInput = {
            title: values.title,
            start: new Date(values.start),
            end: new Date(values.end),
            allDay: values.allDay,
            description: values.description,
            slotsAvailable:
              typeof values.slotsAvailable === "string"
                ? Number.parseInt(values.slotsAvailable)
                : values.slotsAvailable,
          };
          if (eventToEdit) {
            await updateOrganizationEvent(eventToEdit._id, eventInput);
          } else {
            await addOrganizationEvent(organizationId, eventInput);
          }
          actions.setSubmitting(false);
          actions.resetForm();
          onCompleted();
        }}
        validationSchema={Yup.object({
          title: Yup.string().required("Required"),
          start: Yup.date().required("Required"),
          end: Yup.date().required("Required"),
          allDay: Yup.boolean().required("Required"),
          description: Yup.string(),
          slotsAvailable: Yup.number()
            .integer()
            .positive()
            .required("Required"),
        })}
      >
        {({ isValid, dirty, isSubmitting }) => (
          <Form className="flex flex-col h-full flex-1">
            <FormikTextInput name="title" label="Title" type="text" />
            <FormikTextInput name="start" label="Start" type="datetime-local" />
            <FormikTextInput name="end" label="End" type="datetime-local" />
            <FormikTextArea name="description" label="Event description" />
            <FormikTextInput
              name="slotsAvailable"
              label="Slots available"
              type="number"
            />
            <div className="flex-grow"></div>
            <div className="modal-action">
              {eventToEdit && (
                <button
                  type="button"
                  className="btn btn-neutral swap-on"
                  onClick={() => {
                    onDelete && onDelete(eventToEdit);
                  }}
                >
                  Delete
                </button>
              )}
              <div className="flex-1"></div>
              <button
                type="button"
                className="btn"
                disabled={isSubmitting}
                onClick={onCancel}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!isValid || !dirty || isSubmitting}
              >
                {eventToEdit ? "Update" : "Submit"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}

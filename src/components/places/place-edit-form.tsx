"use client";

import { Form, Formik } from "formik";
import * as Yup from "yup";
import { Organization, OrganizationInput } from "../../models/Organization";
import FormikTextInput from "../formik/formik-text-input";
import FormikTextArea from "../formik/formik-text-area";
import { usePlacesFormStore } from "./store/places-form-store";
import { useUserPlacesListStore } from "./store/user-places-list-store";

export default function PlaceEditForm({
  placeToEdit,
}: {
  placeToEdit: Organization | null;
}) {
  const switchForm = usePlacesFormStore((state) => state.switchForm);
  const updateUserPlace = useUserPlacesListStore((state) => state.updatePlace);
  const addUserPlace = useUserPlacesListStore((state) => state.addPlace);
  return (
    <Formik
      initialValues={
        {
          name: placeToEdit?.name ?? "",
          city: placeToEdit?.city ?? "",
          address: placeToEdit?.address ?? "",
          phone: placeToEdit?.phone ?? "",
          description: placeToEdit?.description ?? "",
          url: placeToEdit?.url ?? "",
        } satisfies OrganizationInput
      }
      onSubmit={async (values) => {
        if (placeToEdit) {
          await updateUserPlace({ ...values, _id: placeToEdit._id });
        } else {
          await addUserPlace(values);
        }
        switchForm();
      }}
      validationSchema={Yup.object({
        name: Yup.string().required("Required"),
        city: Yup.string().required("Required"),
        address: Yup.string().required("Required"),
        phone: Yup.string().required("Required"),
        description: Yup.string(),
        url: Yup.string().url(),
      })}
    >
      {({ isValid, dirty, isSubmitting }) => (
        <Form className="block p-2">
          <FormikTextInput
            name="name"
            label="Place name"
            type="text"
            placeholder="Central concert hall"
          />
          <FormikTextInput
            name="city"
            label="City"
            type="text"
            placeholder="Kyiv"
          />
          <FormikTextInput
            name="address"
            label="Address"
            type="text"
            placeholder="Bankova, 1"
          />
          <FormikTextInput
            name="phone"
            label="Contact phone"
            type="tel"
            placeholder="000 000 00 00"
          />
          <FormikTextArea
            name="description"
            label="Place description"
            placeholder="600 siting places, excellent restaurant"
          />
          <FormikTextInput
            name="url"
            label="Url for map or website"
            type="url"
          />
          <div className="flex justify-end mt-8">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!isValid || !dirty || isSubmitting}
            >
              {placeToEdit ? "Update" : "Submit"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

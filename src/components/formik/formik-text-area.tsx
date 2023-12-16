import { FieldHookConfig, useField } from "formik";

export default function FormikTextArea({
  label,
  ...props
}: {
  label: string;
} & FieldHookConfig<string>) {
  const [field, meta] = useField(props as any);
  return (
    <div className="form-control w-full">
      <label className="label" htmlFor={props.id || props.name}>
        <span className="label-text">{label}</span>
      </label>
      <textarea
        type="text"
        className={`textarea textarea-bordered ${
          meta.touched && meta.error ? "textarea-error" : ""
        }`}
        {...(field as any)}
        {...props}
      />
      {meta.touched && meta.error ? (
        <label className="label">
          <span className="label-text-alt text-error">{meta.error}</span>
        </label>
      ) : null}
    </div>
  );
}

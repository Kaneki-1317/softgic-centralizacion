export default function SelectFilter({
  label,
  value,
  options,
  onChange,
}) {
  return (
    <label className="field">
      <span>{label}</span>

      <select
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
      >
        <option value="">
          Todos
        </option>

        {options.map((option) => (
          <option
            key={option.id}
            value={option.label}
          >
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
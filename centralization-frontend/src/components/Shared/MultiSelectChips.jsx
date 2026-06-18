export default function MultiSelectChips({
  options,
  values,
  onChange,
}) {
  function toggle(value) {
    if (
      values.includes(value)
    ) {
      onChange(
        values.filter(
          (item) =>
            item !== value
        )
      );

      return;
    }

    onChange([
      ...values,
      value,
    ]);
  }

  return (
    <div className="chip-selector">

      {options.map(
        (option) => (
          <button
            key={option}
            type="button"
            className={
              values.includes(
                option
              )
                ? "chip active"
                : "chip"
            }
            onClick={() =>
              toggle(option)
            }
          >
            {option}
          </button>
        )
      )}

    </div>
  );
}
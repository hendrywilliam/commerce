interface Props {
  message?: string;
}

export default function NoResultMessage({ message = "No data shown" }: Props) {
  return (
    <div className="flex h-56 w-full items-center justify-center rounded border">
      <p>{message}</p>
    </div>
  );
}

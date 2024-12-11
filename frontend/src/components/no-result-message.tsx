interface Props {
  message?: string;
}

export default function NoResultMessage({ message = "No data shown" }: Props) {
  return (
    <div className="my-4 flex h-56 w-full items-center justify-center rounded border">
      <p>{message}</p>
    </div>
  );
}

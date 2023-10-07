import SignUpForm from "./components/signup-form";

export default function SignupPage() {
  return (
    <div className="flex h-screen w-screen">
      <section className="flex w-full h-full justify-center items-center">
        <div className="flex flex-col w-2/6 h-max">
          <div className="text-start w-full mb-4">
            <h2 className="text-2xl font-semibold">Sign up</h2>
            <p className="text-gray-600">Already have an account?</p>
          </div>
          <SignUpForm />
        </div>
      </section>
      <section className="relative h-full w-2/4 border-l">
        <div className="absolute -left-20 top-1/2 py-6 px-4 bg-white z-2">
          <h1 className="text-xl font-bold">TWOPOINTONE.</h1>
        </div>
      </section>
    </div>
  );
}

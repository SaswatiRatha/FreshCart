const Login = () => {
  return (
    <div className="hero bg-base-200">
      <div className="hero-content w-full max-w-sm flex-col">
        <h2 className="text-center text-2xl/9 font-bold tracking-tight">
          Sign in to your account
        </h2>

        <div className="card bg-base-100 w-full max-w-3xl shrink-0 shadow-2xl">
          <div className="card-body">
            <fieldset className="fieldset w-full">
              <label className="label">Email</label>
              <input
                type="email"
                className="input w-full"
                placeholder="Email"
              />

              <label className="label">Password</label>
              <input
                type="password"
                className="input w-full"
                placeholder="Password"
              />

              <div>
                <a className="link link-hover">Forgot password?</a>
              </div>

              <button className="btn btn-neutral mt-4 w-full">Login</button>
            </fieldset>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

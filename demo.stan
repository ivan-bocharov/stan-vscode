functions {
  void foo(data array[,] real x){
    print(x);
    return;
  }
}

data {
  int<lower=0> J;
  real y[J];
  real<lower=0> sigma[J];
}

parameters {
  real mu;
  real<lower=0> tau;
  real<offset=0, multiplier=1> affine;
  real theta[J];
}

model {
  mu ~ normal(0, 5);
  tau ~ cauchy(0, 5);
  theta ~ normal(mu, tau);
  y ~ normal(theta, sigma);
}

generated quantities {
    complex z = 3.4i;
    complex_vector[2] = [z,z]';

    vector[J] log_likelihood;
    vector[J] y_hat;
    for (j in 1:J) {
        log_likelihood[j] = normal_lpdf(y[j] | theta[j], sigma[j]);
        y_hat[j] = normal_rng(theta[j], sigma[j]);
    }
}

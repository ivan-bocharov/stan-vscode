# Change Log

# 0.2.2
- Snippets
  - Control Flow: `if`, `else`, `elseif`, `for`, `ifelse`
  - Profile: `profile`
  - Program Blocks: `data`, `transformed data`, `parameters`, `transformed parameters`, `model`, `generated quantities`, `functions`
  - include Directive: `include`
- Added indentation rules (fixes #1)
- Added better support to code folding
- Better support for the `#include` directive (better highlighting for files inside `""`)
- Removed old tmLanguage XML files and adopted tmLanguage.json new formats
- Added `invalid.illegal.variable` for variables named after Program Blocks (`data`, `model` etc.) (fixes the Known Issues header in README)
- Improved README with GIFs showing features and an updated syntax highlighting example (fixes #4)
- Organized stuff in folders

# 0.2.1
- QR decomposition
	- Added `qr_Q` and `qr_R` to deprecated functions.
	- added `qr_thin_Q` and `qr_thin_R` to functions.

		The functions `qr_thin_Q` and `qr_thin_R` implement the thin QR decomposition, which is to be preferred to the fat QR decomposition that would be obtained by using `qr_Q` and `qr_R`, as the latter would more easily run out of memory ... (Section 1.2 Stan's User Guide)

- Moved functions to deprecated functions (Section 10 of Stan Function Reference)
  - `integrate_ode_rk45`
  - `integrate_ode_bdf`
  - `integrate_ode_adams`

- New unnormalized distributions (Stan v 2.25)
  - Changed all `*_lpdf` to also accept the new `*_lupdf` (unnormalized log PDF) -- `_l[u]?pdf` (Section of Discrete Distributions in Stan Functions Reference).
  - Changed all `*_lpmf` to also accept the new `*_lupmf` (unnormalized log PDF) -- `_l[u]?pmf` (Section of Continuous Distributions in Stan Functions Reference).

- New functions
  - `hmm_marginal` function (Stan v 2.24)
  - `reduce_sum` and `reduce_sum_static` functions (Stan v 2.23)
  - `map_rect` function (Stan v 2.18)
  - `integrate_1d` function (Stan v 2.18)
  - `algebra_solver` and `algebra_solver_newton` functions (Stan v 2.24)

- New GLM more efficient distribution functions
  - Added the new discrete distribution family `bernoulli_logit_glm` Section 12.3 Stan Functions Reference) -- `bernoulli_logit_glm` and `bernoulli_logit_glm_l[u]?pmf`.
  - - Added the new discrete distribution family `ordered_logistic_glm` Section 13.9 Stan Functions Reference) -- `ordered_logistic_glm` and `ordered_logistic_glm_l[u]?pmf`.
  - Added the new discrete distribution family `neg_binomial_2_log_glm` Section 14.4 Stan Functions Reference) -- `neg_binomial_2_log_glm` and `neg_binomial_2_log_glm_l[u]?pmf`.
  - Added the new discrete distribution family `poisson_log_glm` Section 14.7 Stan Functions Reference) -- `poisson_log_glm_lupmf` and `poisson_log_glm_l[u]?pmf`.
  - Added the new continuous distribution family `normal_id_glm` (Section 16.2 Stan Functions Reference) -- `normal_id_glm` and `normal_id_glm_l[u]?pdf`.

- New distributions
  - `discrete_range` (Section 13.7 Stan Functions Reference) -- `discrete_range` and [`discrete_range_cdf|discrete_range_lccdf|discrete_range_lcdf|discrete_range_l[u]?pmf|discrete_range_rng`]
  - `ordered_probit` (Section 13.10 Stan Functions Reference) -- `ordered_probit` and [`ordered_probit_l[u]?pdf|ordered_probit_rng`]
  - `multinomial_logit` (Section 15.2 Stan Functions Reference) -- `multinomial_logit` and [`multinomial_logit_l[u]?pdf|multinomial_logit_rng`]
  - `beta_proportion` (Section 19.2 Stan Functions Reference) -- `beta_proportion` and [`beta_proportionbeta_proportion_lccdf|beta_proportion_lcdf|beta_proportion_l[u]?pdf|beta_proportion_rng`])

# 0.2.0
- Switched to the grammar from [atom-language-stan](https://github.com/jrnold/atom-language-stan) project.

# 0.1.1
- Added `language-configuration.json`. Minor changes in the README.

# 0.0.1
- Initial release

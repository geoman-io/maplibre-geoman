var Sp = Object.defineProperty;
var Mp = (n, r, e) => r in n ? Sp(n, r, { enumerable: !0, configurable: !0, writable: !0, value: e }) : n[r] = e;
var R = (n, r, e) => Mp(n, typeof r != "symbol" ? r + "" : r, e);
import ku from "maplibre-gl";
const of = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AYht+mLYpUHOwgopChOtlFRRxrFYpQIdQKrTqYXPoHTRqSFBdHwbXg4M9i1cHFWVcHV0EQ/AFxdnBSdJESv0sKLWK847iH97735e47QGhWmWaFEoCm22YmlRRz+VWx5xUhmmGMIi4zy5iTpDR8x9c9Any/i/Ms/7o/R79asBgQEIkTzDBt4g3imU3b4LxPHGVlWSU+J54w6YLEj1xXPH7jXHJZ4JlRM5uZJ44Si6UuVrqYlU2NeJo4pmo65Qs5j1XOW5y1ap2178lfGCnoK8tcpzWCFBaxBAkiFNRRQRU24rTrpFjI0HnSxz/s+iVyKeSqgJFjATVokF0/+B/87q1VnJr0kiJJIPziOB9jQM8u0Go4zvex47ROgOAzcKV3/LUmMPtJeqOjxY6AgW3g4rqjKXvA5Q4w9GTIpuxKQVpCsQi8n9E35YHBW6Bvzetb+xynD0CWepW+AQ4OgfESZa/7vLu3u2//1rT79wN2rHKoBaSKHQAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAN1wAADdcBQiibeAAAAAd0SU1FB+gEBAUlKJesuC4AABWbSURBVHja7Z3fcxTHEce/t1ohYekA2QaBDBgocGLHNmW7Kg4pV9l5SeUleci/4b9H/0aeU3mJXXEF5yEmEOw4hgKFH7JBtpEQwhLS3eVhunV9w+7tHWh3e2Z7q64OyZJ18+Mz3+7pme4W7Bn6tBdXWwD4lYj3FMA0gCkAswCOAJihrw8AOAfgdwDOAmgDmKDf3YunB6ADYB3AdQB/BnANwEMAWwA2ANwH8Ii+3gSwA6BLv8vvvfWPD/VslPOflnVBLhQQYKQCiEl6zQCYB/AigGMA3gBwGMB+guQQgFfpfZKg2sunC2AbwCqA/9H7FoCfAKwA+ArAtwB+BHCPoNmmFwOzw6AAgMFigIyrFhMChgMERJu+PkJQHCNI5un7qfi9F+i9VUJf88TeBvCY3js06TcIih8Jkq9IUTZIde6R2myI3zNVMUBGAiOlST1NrwMAjgM4BeAtAUKbIJklxZim35WAJSXB4UPSlROcINkkRXlEcKwLcP4NYAnAHQJlk17bUlUMlIYDkgHGPpr8BwEcJWVYAPA2AXKcwGAza0ooRiL6s1Vx//Yy3rtCUbaEebVOYCwBuAJgmZTmOwBrBNETA6XBgAwBYw7ACYLhbYLjRYLlIP3MpOest2oAYhxgep5zvk0QrBEUPxIkVwia2wAeGCgNBGQEME4DeIcAOUHm1bRwztMaVWIv1WVHOOubZGbdJkAuAbhpoDQIELErlRSAcZq+nhNqMeEpReh91vOUpSNU5QGBcbMAlG5Tdr1aDYGjRROdYxZFYOzzHO4Y+8o3w3YIgCJQOLbSaYKatBoAR0JKsB/Ay2Q+nRkRjKaYoL0RQblBZtj3cPGWbQDdmCFpRQyGVI0DcFuybwL4FVx0+6SBMRYot+Ci9p8DuAq3dfwwdjVpRQxHCheoO0xKcY7geJNgaRsYY4GyTlBcJUiukbKswAUqd2KEpBUhHBM06WfgotznAVwgQE6TmbWffiYxMEYCpUsA/ETm1U0C5CKAy3DR+g36mU5MkLQiAsM3qeYJjg/pfZ6+P4X+wUEDYzxQOmRSPYSLyF8G8Cm934vR5GpFBEeWSXWB4DiGwXNSMDieCRJg8LzXtwTHxVhNrlZEcMzCRb59k+owgZOaauypmuwQCCsZJtcy3HZw8JCkEcHxCoB3AXxkJlUli2oqVHmGFqIZsRDdZUjai6vBBhXTwOHgo+gMx2/ofcEzqQyMvYfEP7YzhcGjOCBINgBshwpJGigciYBjwYPjFQFHYnCUDgovQKzi/rMsIAkuqJgGCscU+kfSz5NZxXDMmr9ROSS8YPmQsLrwUfqt0CBpBQrHS+SE/xzArwmSBYNDjfP+iJTjMoC/A/ianPgf4LaBg4GkFRAcLbjI9xyA1wH8Fu6G31m4yLjtVOmC5DFc5P063A3GvwD4D9yxlScIZHcrCQgO9jmOknK8Re9Hvd0Tg6N+5z0tGKtJAC1xDcEAeU44UuGQnyez6iz6x0ZsG1cfJBPon6A+65nCuwuadkiSQODIinMcMTiCgeTIsM0UzZCkyjvZh0PGOV4wOILwbydorBbQP67Cz24wMeO/GSAF6iE71o9z2G5VWJDIhc536u8A2Ggvrqp02lPFcEzBHV+wOEeckPBu1xYrSHtxVd1R+UQhHGxaHYA7bHghy7kzOIL0SfzNlgs0xge0+iOpwo7kTpyHCwaew2BaT4MjfCXxx3eFlKSrzR9RoyCe33EsZ4Wxs1XhQ5LkWAjHeONFk4okiuBIPL+DbwIexuCRdXvCh2SiYKwTLZAkSuDgSHnuqmJwRAlJnrWgJtKuxcSSAaU8v8Oe+CDJ8kdkALjZCuKZVi+jn7dqYGcDcWY19EsX5L3kz8YGiL9jyWmZXtZiaqVKVpFZuIyHfgfFYlrllSfojdFPdZZXqMIf4QVyDS5Dyjr6JRt6jQMk4wj7GfSPrquR2D2Cwi9BwAEyruxUpPI8ieROntbSC89rYp+luXAHlGurvbjaqiuAmNa8erANegIuV+5JuIyHIZtWWdnT/SI2G/DS4xT0Eacz4qPiecV7QuwzGR9p0xx4By5TCt8dqU1FagEkQz1O02uOvhdivMNP18n1N7LKoN2HuzwkA2S9HLOKt0NfR7+Sblb5t0mEm0aV2+rPh9t1q0haY4f46nEi0F2rvITPsoJTViHNFfTTdfZG6KcryC8gKitghZpvOGtO1K4ilQMygnqEMqhFJQOWMFgD0C/FvAWvDPOQnZ4HBJQsQX0VT9dQDLmUQ968qFVFUiUrRWjqIZ3tvFoaS/S1rCK74znrow42A8WmyAO4JNJchfc6ATKs5kkSCCSqVKRSQCJQDz+J8yMUly3z65Dv7nCNuhpSv3VF32yLv79GCnWL/nZW1Sz2VbRfMFOnIqmCFSIU9cjKSbsEV3WpsPDlOED4j/i9ngcM1xfMUjEG5Qypi8xRDOWQqFGRyjpJRM33w12a+RDAH+HO4cyhX15Zs0nVwWDOp4tk3txCTRVhCyr3noSLK8g7NbN4uq67tofLVT+gfv4TXJmFu3A1SirLq1W1giRkNx8lxzIE9fDriy8D+ALAJzR4XIqsllLJ9Hd6BMq25xc9FDtn/Nn44tmkYkh8FXkbwH8hEs/FaGLxsYJpsfuye3JT6UCxv8G1xLlozCcEyTKZW9vsY9QV8c0AhQOUm56pt4N+5vtp6DzO45/wXqA5M00K3qnKzKoEkIwj7bLBE8rh4AyBN5BdA6MDRak0BShyQ+GugGMD7tTsGfQzUmqFJGtBXYNLhF2Js55W2FiWzOMkmUep8YlSOLq0+t4H8E8AnwH4BoFUUVr/+FCvvbjKO2eP4M42bdFnfw3ABwDeo3HYr9Tc8k3ya7RjV5mzXvrkzEjEcIpeB5WaV9LneEjK8RmAfwD4EoMFK1Xnl2U1wWDJtC+pLZ9R2x5KE1GpmXVQzJtKEzykFa8E83B5Wo8rdc6lWbJBPsc1Uo5lAKu0CgdTyTXD5OLP/Q21ja+5tqHvZLBvebwFd4btB1KRbhUTt8qVoE2QtBWrh5++/yKZVWuhwZEBCgc416hNmTUFlapILXOnKvtfVoSSW4xanXJ/K3clZDhyIFlB9o5cB/puL9Y2f0r9IxnZ2Y8oVQ/2O4ZOnBjqfgtIhi0EmvwRX0WOoMLs8GlFELL/8QY1cEqZgkjTaikA02OvTcmsBWxS0QLG92L4mP9VuMOapQcNkwro5+uiL8LdX9CWW5cd1ydwRxtuwB0fuS9NjhjUI2N3S8Z5rlPbdytAKVkU/DIYfAemkpwFpQGSUd+j0oY9w2q6AXfQ7xLc2ard7c+Y4PAgkdvZt6jtuydnlZlZuQttmWZW2QriS+M8dAUHffW4icGTo1HCkQFJXvs1pRuqxVSvwsRi+/Yw9CWgzlIPjSto0/ugVTCXggSEG8WX8aehKzBYpB69mNUjwx8JQUUYkmkMJvcI1sSqvEGmHtGrSKULbimAZMQ/KpPEMdVjGy6qvESvRqnHEBXh/lhD/1CgFkgy51RZjnpSMnwyp9Nh6Ip/8Gnd7+CyjzRVPfJU5Ar1zSYqvKCkbU6V7YNwinttDro8cvEjXLCMt3UbpR4ZKsLbvpyuiFOk1t0nWVZJ6XdZkhIbw///FP00mZrMK44kf0sTYRM6zyHVsXBsop/wTp4k0GRmyVzFKGtuVXWaV5NzzubVFlwE+Su4Y+2aTAkNpuc99LNBbinqmxaeznYflpM+RFG0rJJsSqzDS2rQRPMqw8xiX4TzCWty1CudU0lD54LMUsLJ3Uw9rH8aD0hIK6RKhW1aHzVRQeS9D78EgT3WR40HRB7zXjH/o9AP4Qwujdzha6KJxSskV31qamBwlL6SfdT1+tAAacAE6JrvUeiLdJvcP4lNAnusjwwQe+wxQOyxxwCxp+qnZYDY4NuT3TeVnXkyQHROAG2HKLX1T2WnZg0QXYqh8Ri+iifnNqjWGiIGSEmQZF7kqiKdfkDzQvNtUAPEBl+FeaU1XVN0gGhLhKw9mbYW51xjuqZK51RSUUO0HekIoRyDBgXRmq6psiMwScl0azwUWGs6/QAddG2VwCo9RJmU3JDMY+UKQNGeM7juvtFYrqKWY/hlNlrrpZu8rPOaS1JX2Tey9LK2chWVz6lSAMm5dKMtjaVMp881uCebamYNqWWvqVxF7pwq67JbUlGDNtGvSqrFWfdrcJ+Azsq7VTvmM9QX2mrZS+f8Cc2p0hfcJLYGPYOjLmtwz9GuTaNURKjHPuoD7g9ttewrX3CrUpANhY66v2K+02AV0d4XtZnsZQOiOTuGv2qeplejVCRDPZ7qByWLRS1zqTRAAsnSZyoSRh/Ulg0zqYh8rVn6ilbPJGYVobYlAahHbfMoqZN8xSpyEv1t3yghEXDwtu5J5epRiyVSlYJoztLnq8gZAGfhIsi79yBigkT4HXzs/wi1+Yxi9ahlDpUKSEDZwmVk/RSACwDOwwXLZiP0R2R7F6itF6jt2tpbazb+pMIVQHO2cDY3+J7IeQAfAXiXJtALACZiUBFqAyvHArXxI2qzvBujqa21zZ+0xhVgjuzfnpLB8CeOVL/d08jtxdVOqDl8BRxDFwKF6lGbBVKlgoRQ0SnP9DgNF1WeClVJPDgOUptCMCVrrXhVuoKsf3yo115czasJOKtsxeLPMUE7OfMAzgF4Da48MuBKI2+1F1c7CCAjvOeQMxwL1KZz1MYZMQ7aqoHl1kysou+TihuaWVUW+kp7ye3PMwA+APA+gF/AHQEP4oJVxgWoY9SG96lNZyC2s6G3VF5tVXerPKXp1yW/A711yRmSabgt0PcA/B7AHwD8EsBxYZKojJOIOAebjMfps/+B2vIetW0aOpPDSd/jDmqq216Fky7NrG0yUZbo9aqYaD1lgySd9qPIrve+DHerbbu9uNrVYHIJ1WAVzNqtmifl0HpJTKqHnC9rqLiWfVrzivAzAC9Bb9odhmQ/nk40x6bLfTIBngDYoYWgclAEGPy59hEERzJ2q2aUmlXqLI7KAPFURNqUGp31PJ+kDeAVz66/DuAWOfEbVYOSA8YM3Db6SbgIub9bNaEcDt85H/BZq1x80pobzrsSh6ArJpIHSUvY85z04QaASwBuAridBwovEnsIBYaAcQJuG/cdcsRPoZ9CVHsCuDznfBM11ElMa+gAua/9Je2qvAz92Q1bos/YD2kTLKcJkCxQtmlguwQLxgXGA0ICO4F+fi8fjNP09RxBLe+Wa47jqHDOawEksJhIHiS+E+xPTgZliUB5SO3jK8d8TVQCM46C8c7UNL0O0N8+lQHGDClLijDKGKhxzutUkDz78qByMyvPL8kzb5Zo9WMT4Z5QlG0MJtPrFQDJGwSTAsp59DOyvE2AZIHRQlhpVVWFA1IlnXCWBnsf+kkCEAAkLRq0LFBepV069rX4mMQG3HmiUe5V+1kO2+jnFH4D/ZxeR2mBCRkMVc55bYAMiYmcFLZ9L6CBzQNlFm4Le4vMybcIDD50599r6OWolMxEz2lSOWUq+xbT4m+HCIY657xuBZGO2G2y2eVVz8kABzgLlCka3IO0EcHm1QaZRY9HVBAZpGQzi2Mycss25Az1/pyo1TmvFRChIk9ot+cmvU4EqiJ5oMidpin084TN0YTvjDD4/P+Y8pxtP+N6yHdVWD14PtTunNetILGqiA8KPFh4kCUw4+5iIRIoiubCbSg4q1db3EFcx/VV5AF9T9sp371QlUS8UmGKDXtNCuVIEF/h0cJ5UOf5tlThyhGTihSpC2BVrdSqR60K0kAVsScw9agdkBBWEHuaPfa1A2IqYuqhVT20KIipiKmH2jFXAYipiKmHRvXQpCCmIqYeKsdaDSCmIqYe2tRDm4KYiph6qBtjVYCMoCJdgyR4OLqhqIdGBclbYW7BHRXXVFfEnmczrXZoLG+FYCGoAyRDRW7AZQ65D+AnuBOw9oT5dGgM79OY3tCsHkD9Z7GKVOQR3LHnz9G/Mcf5nEK4Y23PoGm1BeB7AFdpTJcgcu1q/OAqs4jQShJkh9oz8oJ3lcZ2C0BXaxLwRHnHDpNkc9jDdMyDMpnVAuKVb5NOnTns4TvmA2OouYSEagURppY57HE65l3t9VXSADrYHHZzzE1BnsFhvwm9RXjsCdgxDwqQHKm+Ri8ztcwxN0CEw85JxW5mrUimIuaYN1ZBLDZijrkBsgedb5DUrh6dmBaxoAApiI2Yw67HtMo1g0NSjyAVpCA2UpTr1p5yAeFT2Pdi2UhJAx8M3kK8iH5cZIL+HVP2wVBMq8dwpR4u05gMbMWHph6h+iC+w75CA/IpvQ8rKWBPOXAUjkWIcAQLiICkcNUySCrxO+T2+0Uai29pbDqhwhE0IDHbvYE9WQFcLjcXvD8YNCDerpYFEOszrbKOAAUVEIxVQaSpZWe16jWt/IWpEzocUQBSIPVmall/GyAjntWqrRBkhOpRqNgxqEdUCjLCsXi7gbh3plVU0fJhTxrhIGZJ/2G4moBc+swCiM8OSKN2DWPyQfJMraf25U1Fnsu0ii5a3hhAMkytvMiuQfLsfkd00fJGASIgGbbamT/yfH5HVNHypvkgRfay+SN704/RRMsbpyCeP7Jj/khpfkcU0fJGAuKZWuaPlON3dGKGI3pAzB8xv8N8EPNHzO8wBTF/xPwOA8T8EfM7DJAA/JGm3h/hAGvj/Y7GAjKifd1poNPeE+rReL+j0YAU+CPLaGaWRpklZrnpfkfTFSTPH/kEwBc0QZrktEuzc5n64JMm+x3ySdHQZ/3jQ7324qqcGJxHK4Xb+uVt3wnEu/070kLRVDgaDUiOaZHCJZ07TO8MSYwFeoY55U01Nc3EyvFHRnFOe5HBMdJmRZPVo/GACEiGraSxQeLDkeeUd5sOhwEymtN+NzJzQ5qVd80pNx/keZx2floAjiP8pNhZO1Z/NafcAHnW1ZXhiGFnq0kqaSZWyU57oX0e2EQa2c8y9TBAxoUk9J2tkdtjcBgg40ASw86W7VgZIKVCMqrN3lMOh+1YmZNeDiRDdrYA4BUAs6IfW8rhsB0rA6SUyebvbOVB0lL6mSUctmNlgOy5imAIJNpiJMNiHQNwmHoYIGVDoi1GMrLfZHCYk16G0645RmKxDgNEHSRaYiQW6zBAVEGiKUZisQ4DRCUkGmIkFuswJ121415njMRiHQaI+mecGMleQlIEh8U6DBA1KoKKIRkLDlMPA6RJkBgcBohBYnAYIAbJeJAYHAaIQWJwGCAGyXiQGBwGiEGSA4nBYYAYJDmQGBwGiEGSAwkMDgPEIBkOicFhgBgkGZDM0L83DA4DxCDpP1xi4Sh9/R2ASwaHAdJkSPjuRgJgEv167QBwFcDfAPwLdhuw1sfug9QAiXDCH8Pd+Psa7v7GHXpdpu/do58xOGp6/g9eQPkxBqxc0wAAAABJRU5ErkJggg==", uf = {
  draw: {
    marker: {
      type: "draw",
      eventType: "toggle",
      targetMode: "marker",
      settings: {
        exclusive: !0
      }
    },
    circle_marker: {
      type: "draw",
      eventType: "toggle",
      targetMode: "circle_marker",
      settings: {
        exclusive: !0
      }
    },
    text_marker: {
      type: "draw",
      eventType: "toggle",
      targetMode: "text_marker",
      settings: {
        exclusive: !0
      }
    },
    circle: {
      type: "draw",
      eventType: "toggle",
      targetMode: "circle",
      settings: {
        exclusive: !0
      }
    },
    line: {
      type: "draw",
      eventType: "toggle",
      targetMode: "line",
      settings: {
        exclusive: !0
      }
    },
    rectangle: {
      type: "draw",
      eventType: "toggle",
      targetMode: "rectangle",
      settings: {
        exclusive: !0
      }
    },
    polygon: {
      type: "draw",
      eventType: "toggle",
      targetMode: "polygon",
      settings: {
        exclusive: !0
      }
    },
    freehand: {
      type: "draw",
      eventType: "toggle",
      targetMode: "freehand",
      settings: {
        exclusive: !0
      }
    },
    custom_shape: {
      type: "draw",
      eventType: "toggle",
      targetMode: "custom_shape",
      settings: {
        exclusive: !0
      }
    }
  },
  edit: {
    drag: {
      type: "edit",
      eventType: "toggle",
      targetMode: "drag",
      settings: {
        exclusive: !0
      }
    },
    change: {
      type: "edit",
      eventType: "toggle",
      targetMode: "change",
      settings: {
        exclusive: !0
      }
    },
    rotate: {
      type: "edit",
      eventType: "toggle",
      targetMode: "rotate",
      settings: {
        exclusive: !0
      }
    },
    scale: {
      type: "edit",
      eventType: "toggle",
      targetMode: "scale",
      settings: {
        exclusive: !0
      }
    },
    copy: {
      type: "edit",
      eventType: "toggle",
      targetMode: "copy",
      settings: {
        exclusive: !0
      }
    },
    cut: {
      type: "edit",
      eventType: "toggle",
      targetMode: "cut",
      settings: {
        exclusive: !0
      }
    },
    split: {
      type: "edit",
      eventType: "toggle",
      targetMode: "split",
      settings: {
        exclusive: !0
      }
    },
    union: {
      type: "edit",
      eventType: "toggle",
      targetMode: "union",
      settings: {
        exclusive: !0
      }
    },
    difference: {
      type: "edit",
      eventType: "toggle",
      targetMode: "difference",
      settings: {
        exclusive: !0
      }
    },
    line_simplification: {
      type: "edit",
      eventType: "toggle",
      targetMode: "line_simplification",
      settings: {
        exclusive: !0
      }
    },
    lasso: {
      type: "edit",
      eventType: "toggle",
      targetMode: "lasso",
      settings: {
        exclusive: !0
      }
    },
    delete: {
      type: "edit",
      eventType: "toggle",
      targetMode: "delete",
      settings: {
        exclusive: !0
      }
    }
  },
  helper: {
    shape_markers: {
      type: "helper",
      eventType: "toggle",
      targetMode: "shape_markers",
      settings: {
        exclusive: !1,
        enabledBy: [
          "drag",
          "change",
          "rotate",
          "scale",
          "line_simplification"
        ]
      }
    },
    snapping: {
      type: "helper",
      eventType: "toggle",
      targetMode: "snapping",
      settings: {
        exclusive: !1
      }
    },
    pin: {
      type: "helper",
      eventType: "toggle",
      targetMode: "pin",
      settings: {
        exclusive: !1
      }
    },
    snap_guides: {
      type: "helper",
      eventType: "toggle",
      targetMode: "snap_guides",
      settings: {
        exclusive: !1
      }
    },
    measurements: {
      type: "helper",
      eventType: "toggle",
      targetMode: "measurements",
      settings: {
        exclusive: !1
      }
    },
    auto_trace: {
      type: "helper",
      eventType: "toggle",
      targetMode: "auto_trace",
      settings: {
        exclusive: !1
      }
    },
    geofencing: {
      type: "helper",
      eventType: "toggle",
      targetMode: "geofencing",
      settings: {
        exclusive: !1
      }
    },
    zoom_to_features: {
      type: "helper",
      eventType: "click",
      targetMode: "zoom_to_features",
      settings: {
        exclusive: !1
      }
    },
    click_to_edit: {
      type: "helper",
      eventType: "toggle",
      targetMode: "click_to_edit",
      settings: {
        exclusive: !1
      }
    }
  }
}, Ip = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <path fill="currentColor"
          d="m22.775 29.562 6.75-6.75-5.625-5.625-3.6 3.6-3.15-3.15 3.6-3.6-5.626-5.55-6.75 6.75zm25.95 26.101 6.75-6.825-5.624-5.625-3.6 3.6-3.15-3.15 3.6-3.6-5.55-5.55-6.75 6.75zm.6-46.126 5.25 5.25ZM16.7 59.039H5v-11.7l14.55-14.551L2 15.237l13.05-13.2 17.7 17.624L46.1 6.312q.676-.676 1.5-.976.826-.3 1.65-.3.826 0 1.65.3.826.3 1.5.976l5.326 5.325q.675.675.975 1.5.3.825.3 1.65t-.3 1.65q-.3.825-.975 1.5l-13.35 13.35L62 48.913l-13.125 13.05-17.551-17.55Zm-7.2-4.5h5.25l29.476-29.552-5.25-5.25L9.5 49.288Zm32.1-32.178-2.625-2.625 5.25 5.25Z"/>
</svg>`, lf = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <path fill="none" d="M0 0h24v24H0Z"/>
    <circle cx="32" cy="32" r="26" fill="currentColor" fill-opacity=".15" stroke="currentColor" stroke-width="7"/>
    <circle cx="32" cy="32" r="5" fill="currentColor"/>
</svg>`, bp = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <path fill="none" d="M0 0h24v24H0Z"/>
    <circle cx="32" cy="32" r="26" fill="currentColor" fill-opacity=".15" stroke="currentColor" stroke-width="7"/>
    <path stroke="currentColor" stroke-dasharray="3" stroke-width="4" d="M6 32h52M32 6v52"/>
</svg>`, Tp = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <path
            fill="currentColor"
            d="M32 61.4 19.85 49.42l3.28-3.235 6.634 6.542V34.205H10.98l6.26 6.174-3.279 3.234L2.185 32l11.852-11.686 3.28 3.234-6.336 6.247h18.783V11.273l-6.261 6.174-3.28-3.234L32 2.6l11.777 11.613-3.28 3.234-6.26-6.174v18.522h18.782l-6.26-6.174 3.279-3.234L61.815 32 50.038 43.613l-3.28-3.234 6.261-6.174H34.236v18.522l6.634-6.542 3.28 3.234z"
    />
</svg>
`, Lp = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <line x1="8" y1="50" x2="24" y2="20" stroke="currentColor" stroke-width="8"/>
    <line x1="24" y1="20" x2="40" y2="54" stroke="currentColor" stroke-width="8"/>
    <line x1="40" y1="54" x2="54" y2="10" stroke="currentColor" stroke-width="8"/>
    <circle cx="8" cy="50" r="6" fill="white" stroke="currentColor" stroke-width="4.5"/>
    <circle cx="24" cy="20" r="6" fill="white" stroke="currentColor" stroke-width="4.5"/>
    <circle cx="40" cy="54" r="6" fill="white" stroke="currentColor" stroke-width="4.5"/>
    <circle cx="54" cy="10" r="6" fill="white" stroke="currentColor" stroke-width="4.5"/>
</svg>
`, Cp = `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 64 64">
    <path d="M32 62.81s23.107-21.898 23.107-38.512a23.107 23.107 0 0 0-46.214 0C8.893 40.912 32 62.809 32 62.809m0-26.958a11.554 11.554 0 1 1 0-23.107 11.554 11.554 0 0 1 0 23.107"/>
</svg>
`, Ap = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <!-- Polygon -->
    <polygon points="8,28 40,6 55,35 51,55 18,54" fill="none" stroke="currentColor" stroke-width="8"/>

    <!-- Vertex Circles -->
    <circle cx="9" cy="28" r="6" fill="white" stroke="currentColor" stroke-width="4.5"/>
    <circle cx="40" cy="8" r="6" fill="white" stroke="currentColor" stroke-width="4.5"/>
    <circle cx="55" cy="35" r="6" fill="white" stroke="currentColor" stroke-width="4.5"/>
    <circle cx="50" cy="55" r="6" fill="white" stroke="currentColor" stroke-width="4.5"/>
    <circle cx="18" cy="54" r="6" fill="white" stroke="currentColor" stroke-width="4.5"/>
</svg>
`, Np = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <!-- Rectangle -->
    <polygon points="10,10 54,10 54,54 10,54" fill="none" stroke="currentColor" stroke-width="8"/>

    <!-- Vertex Circles -->
    <circle cx="10" cy="10" r="6" fill="white" stroke="currentColor" stroke-width="4.5"/>
    <circle cx="54" cy="10" r="6" fill="white" stroke="currentColor" stroke-width="4.5"/>
    <circle cx="54" cy="54" r="6" fill="white" stroke="currentColor" stroke-width="4.5"/>
    <circle cx="10" cy="54" r="6" fill="white" stroke="currentColor" stroke-width="4.5"/>
</svg>
`, Op = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <path fill="currentColor"
          d="M39.063 42.14 22.288 28.12 7.96 44.603l11.338 9.854h9.059zm-3.498 12.317h25.941v5.465h-44.25L4.377 48.726a5.465 5.465 0 0 1-.542-7.711L34.311 5.958a5.465 5.465 0 0 1 7.712-.538l16.496 14.343a5.465 5.465 0 0 1 .541 7.709z"/>
</svg>`, Pp = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <path fill="currentColor"
          d="M58.709 17.724c-.3-.6-.601-.901-.902-1.502l-.3-.601c-.301-.601-.602-.902-.902-1.503l-.3-.601c-.301-.601-.602-.902-1.203-1.503l-.6-.901 8.414-9.317-13.825.3-13.824.301 1.502 13.524 1.503 13.524 9.617-10.819v.3l.3.602c.301.3.301.6.602.6l.3.602c0 .6 0 .901.3 1.202.903 2.104 1.804 4.208 2.105 6.311.6 4.208 0 8.716-1.804 12.623l-.6 1.202-.301.3-.902 1.503-.3.601c-.601.601-1.202 1.503-1.804 2.104-1.502 1.503-3.305 3.005-5.109 3.907-1.803 1.202-3.907 1.803-6.311 2.404-2.104.301-4.508.601-6.612.301-2.404-.3-4.508-.902-6.612-1.503-2.103-.901-3.907-2.104-5.71-3.606l-1.202-1.202-.601-.902-.601-.601c-.3-.3-.601-.601-.601-.902l-.902-1.202-.3-.3-.602-1.203c0-.3-.3-.3-.3-.6l-.902-1.503-.3-.601-.902-2.705q-.901-3.607-.901-7.213V27.04c0-.601 0-.901.3-1.202l.3-1.803.602-1.803c.901-2.405 2.103-4.509 3.606-6.612q2.254-3.156 5.41-5.41c.6-.3.901-1.202.3-1.803-.3-.3-.6-.601-.901-.601h-.601l-.3.3c-2.706 1.202-4.81 3.006-6.913 4.809-2.104 2.104-3.607 4.508-5.11 7.213-2.704 5.41-3.606 11.42-2.404 17.431.3 1.503.601 2.705.902 4.207l.902 2.405c.3.3.6.6.6 1.202l.602 1.202c0 .3.3.601.3.601l.902 1.503c.3.601.6.901.901 1.503l.301.6c.3.301.601.902.902 1.203l2.103 1.803c2.104 2.104 4.809 3.907 7.514 5.41q4.057 2.254 9.016 2.705c1.503.3 3.005.3 4.508.3 1.803 0 3.306 0 4.809-.3 3.005-.602 6.311-1.503 9.016-3.006l.6-.3c.602-.3.903-.601 1.504-.902l2.103-1.202c.601-.3.902-.601 1.203-.902l.6-.6a3.622 3.622 0 0 0 1.503-1.504l.3-.3c.902-.902 2.105-2.104 2.706-3.005l1.803-2.705 1.202-1.804c3.005-5.71 4.208-12.322 3.306-18.633-.601-3.306-1.503-6.612-3.005-9.317z"/>
</svg>
`, Rp = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <path stroke="currentColor"
          stroke-width="3.8"
          d="m2.155 32.345 42.35-29.82M18.963 60.919l42.35-29.82M31.443 2.332l29.82 42.35M2.207 19.515l29.82 42.35"/>
</svg>
`, Dp = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <path fill="none" d="M0 0h24v24H0Z"/>
    <path fill="currentColor"
          d="M6.962 3.385h50.076a3.577 3.577 0 0 1 3.577 3.577v50.076a3.577 3.577 0 0 1-3.577 3.577H6.962a3.577 3.577 0 0 1-3.577-3.577V6.962a3.577 3.577 0 0 1 3.577-3.577Zm3.577 7.154v42.922h42.922V10.539Zm7.154 7.154h28.614v7.153H17.693Zm0 14.307h28.614v7.154H17.693Z"/>
</svg>
`, Fp = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <path fill="currentColor"
          d="M16.862 2.13 7.297 21.17a2.091 2.091 0 0 0-.193 1.288l4.107 24.166-7.618 13.15 3.619 2.096 7.997-13.804a2.091 2.091 0 0 0 .252-1.397l-4.119-24.235 9.256-18.428Zm40.876.255-1.25 2.49 2.668 1.341 1.25-2.49zm-2.593 5.16-2.68 5.337 2.668 1.341 2.682-5.338zm-4.022 8.007-2.682 5.338 2.67 1.34 2.681-5.337zm-18.67 5.83.055 6.984-11.118.087.056 7.242 11.12-.088.054 6.985 10.521-10.688zm18.927 2.817-2.945.5 1.001 5.89 2.945-.5zm1.502 8.835-2.945.5 1.001 5.89 2.945-.5zm1.502 8.834-2.945.5.74 4.355-.24.413 2.585 1.499.51-.881a1.494 1.494 0 0 0 .18-1zm-3.943 7.854-2.994 5.17 2.584 1.496 2.994-5.169zm-4.492 7.754-1.497 2.584 2.584 1.497 1.498-2.584z"/>
</svg>
`, Gp = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <path fill="currentColor"
          d="M41.687.926a2.173 2.173 0 0 0-.433.045c-4.075.232-7.358 3.618-7.358 7.747 0 .084.01.164.012.246l-12.987 4.261a7.842 7.842 0 0 0-6.126-3.563 2.173 2.173 0 0 0-.424-.043 2.173 2.173 0 0 0-.435.044c-4.073.232-7.358 3.618-7.358 7.747 0 3.143 1.901 5.869 4.604 7.097L8.377 35.11a2.173 2.173 0 0 0-.028.007C4.274 35.35.99 38.736.99 42.865c0 4.277 3.514 7.791 7.791 7.791 2.497 0 4.727-1.201 6.157-3.048l12.887 6.235a7.67 7.67 0 0 0-.139 1.44c0 4.277 3.515 7.791 7.792 7.791 4.278 0 7.793-3.514 7.793-7.792a7.67 7.67 0 0 0-1.885-5.027l.508-1.05-3.263-1.579 4.505-29.969.888-.29-.368-1.122a7.78 7.78 0 0 0 2.28-1.018l.447 1.364 4.72-1.547-.774-2.359-2.522.826a7.73 7.73 0 0 0 1.672-4.793c0-4.132-3.288-7.52-7.368-7.748a2.173 2.173 0 0 0-.424-.044zm0 4.346a3.414 3.414 0 0 1 3.447 3.446 3.415 3.415 0 0 1-3.446 3.447 3.414 3.414 0 0 1-3.446-3.447 3.414 3.414 0 0 1 3.445-3.446zm20.076 3.725a1.242 1.242 0 0 0-.382.062l-1.612.528.578 1.76-.293 1.94 2.456.37.486-3.234a1.242 1.242 0 0 0-1.233-1.426Zm-4.354 1.364-4.72 1.548.775 2.36 4.719-1.548-.774-2.36zm-22.153 2.732a7.877 7.877 0 0 0 3.735 2.922l-.062.408-.397.13.26.793-4.255 28.298-3.818-1.847-1.082 2.235 3.718 1.798a7.841 7.841 0 0 0-3.543 2.147l-13.272-6.42c.02-.23.035-.458.035-.692 0-2.888-1.609-5.408-3.969-6.745l2.912-11.012c3.74-.562 6.645-3.81 6.645-7.698l-.001-.02 13.094-4.297zm-20.885.87a3.414 3.414 0 0 1 3.445 3.447 3.414 3.414 0 0 1-3.445 3.447 3.414 3.414 0 0 1-3.447-3.447 3.414 3.414 0 0 1 3.446-3.446zm45.314 1.78-.738 4.912 2.456.37.738-4.912zM36.172 17.33l-1.793.588a1.242 1.242 0 0 0-.813.862l-.788 2.978 2.401.634.615-2.325 1.15-.377-.773-2.36zm22.405 5.781-.737 4.913 2.455.368.739-4.91zm-26.432 1.048-1.27 4.802 2.401.634 1.27-4.802zm25.325 6.32-.739 4.913 2.457.368.738-4.911-2.456-.37zm-27.23.882-1.27 4.802 2.402.634 1.27-4.801zm26.124 6.486-.739 4.91 2.455.37.74-4.912-2.457-.368zm-28.027.717-1.27 4.803 2.4.634 1.27-4.802-2.401-.634zm-19.555.856a3.414 3.414 0 0 1 3.446 3.446 3.414 3.414 0 0 1-3.446 3.447 3.414 3.414 0 0 1-3.445-3.447 3.414 3.414 0 0 1 3.445-3.446zm46.473 5.795-.739 4.91 2.456.37.74-4.911zm-11.124 5.072-1.082 2.236 4.47 2.164 1.083-2.237zm-8.651 1.55a3.414 3.414 0 0 1 3.445 3.446 3.414 3.414 0 0 1-3.445 3.447 3.414 3.414 0 0 1-3.447-3.447 3.414 3.414 0 0 1 3.446-3.446zm18.669.745-.358 2.378-2.953-1.428-1.083 2.236 4.472 2.163.541-1.117 1.228.183.608-4.046-2.455-.37z"/>
</svg>
`, Bp = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <circle cx="49.754" cy="50.219" r="10.098" fill="none" stroke="currentColor" stroke-width="5.1"/>
    <path fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="4.491"
          d="M44.516 26.657H17.842l6.669-11.55 6.668-11.55 6.669 11.55Z"/>
    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="6"
          stroke-width="4.683" d="M4.481 40.605h20.761v19.093H4.481z"/>
</svg>
`, Up = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <path stroke="currentColor" fill="currentColor" stroke-width="2"
          d="M44.095 2.247a2.285 2.285 0 0 0-.135.04L12.025 12.762a2.285 2.285 0 0 0-1.497 1.588l-7.772 29.4a2.285 2.285 0 0 0 1.213 2.641L35.397 61.6a2.285 2.285 0 0 0 2.873-.754l22.64-32.582a2.285 2.285 0 0 0 .05-2.534L46.6 3.23a2.285 2.285 0 0 0-2.504-.982ZM43.7 7.182l12.203 19.12-5.167 1.76 1.052 3.09 2.031-.693L38.07 53.122l.01-1.375-3.262-.023-.034 4.5-27.13-13.127 6.975-26.38Zm3.946 21.932-6.18 2.105 1.052 3.09 6.18-2.105zm-9.27 3.157-2.329.793a1.632 1.632 0 0 0-1.105 1.534l-.03 4.068 3.265.024.02-2.91 1.232-.419zm-3.488 9.66-.047 6.529 3.264.023.048-6.528z"/>
</svg>
`, zp = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <path fill="currentColor"
          d="m41.478 7.967-.033 3.069c1.887.02 3.772.337 5.561.933l.97-2.913a21.337 21.337 0 0 0-6.498-1.09Zm-3.294.215a21.567 21.567 0 0 0-6.298 1.915l1.332 2.766a18.518 18.518 0 0 1 5.401-1.641zm12.836 2.155-1.402 2.73a18.497 18.497 0 0 1 4.572 3.312l2.16-2.179a21.548 21.548 0 0 0-5.331-3.863ZM22.783 13.06c-11.848 0-21.486 9.638-21.486 21.486 0 11.849 9.638 21.486 21.486 21.486a21.37 21.37 0 0 0 14.288-5.466c.003 0 .006 0 .009.002.04-.036.078-.075.117-.11l.077-.072a21.285 21.285 0 0 0 1.51-1.532 22.128 22.128 0 0 0 .867-1.025 19.557 19.557 0 0 1-.88-.095c-.196-.025-.389-.058-.582-.09-.097-.015-.194-.028-.29-.045a18.378 18.378 0 0 1-1.576-.359l-.118-.03c-7.753-2.172-13.422-9.271-13.422-17.728a18.34 18.34 0 0 1 5.867-13.478c.1-.093.199-.185.3-.276.153-.136.31-.268.467-.4.097-.08.193-.163.291-.242.255-.203.514-.402.78-.592a21.534 21.534 0 0 0-1.76-.592l-.018-.005c-.176-.05-.355-.095-.533-.141-.132-.035-.263-.073-.397-.105-.213-.051-.43-.095-.646-.14-.077-.016-.153-.035-.231-.05H26.9a21.37 21.37 0 0 0-4.118-.4Zm35.728 3.64-2.472 1.82a18.424 18.424 0 0 1 2.61 5.004l2.907-.986a21.474 21.474 0 0 0-3.045-5.839Zm3.864 9.034-3.022.534c.328 1.86.37 3.772.118 5.642l3.042.409a21.448 21.448 0 0 0-.138-6.585zm-3.496 8.943a18.539 18.539 0 0 1-2.416 5.104l2.543 1.72a21.586 21.586 0 0 0 2.815-5.952zM54.703 42a18.288 18.288 0 0 1-4.428 3.492l1.505 2.675a21.348 21.348 0 0 0 5.173-4.08zm-6.995 4.69a18.512 18.512 0 0 1-5.526 1.158l.163 3.065a21.56 21.56 0 0 0 6.444-1.35z"/>
</svg>
`, qp = `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 64 64">
    <path d="M44.698 2.661a1.644 1.644 0 0 1 2.328 0l9.866 9.866a1.644 1.644 0 0 1 0 2.329L24.004 47.744a1.644 1.644 0 0 1-.552.362L7.008 54.683a1.644 1.644 0 0 1-2.138-2.138l6.578-16.444a1.644 1.644 0 0 1 .362-.552zm-3.089 7.742 7.542 7.541 4.252-4.252-7.541-7.541zm5.216 9.866-7.54-7.54-21.378 21.376v.964h1.644a1.644 1.644 0 0 1 1.645 1.644v1.645h1.644a1.644 1.644 0 0 1 1.645 1.644v1.644h.963zM14.724 37.29l-.35.348L9.35 50.204l12.566-5.025.349-.35a1.644 1.644 0 0 1-1.07-1.538v-1.645h-1.644a1.644 1.644 0 0 1-1.644-1.644v-1.644h-1.644a1.644 1.644 0 0 1-1.54-1.07"/>
    <path stroke="currentColor" stroke-width="5.107"
          d="M6.298 59.53c3.44-1.692 6.88-3.384 10.558-4.319s7.594-1.111 11.719-.298c4.125.814 8.459 2.617 13.483 2.655 5.023.038 10.737-1.689 16.45-3.415"/>
</svg>
`, Yp = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <path fill="currentColor"
          d="M31.226 17.87c-4.69 0-8.532 3.832-8.532 8.508 0 1.812.58 3.495 1.558 4.88l5.932 10.255c.831 1.085 1.383.879 2.074-.058l6.543-11.135c.132-.24.236-.493.327-.753a8.396 8.396 0 0 0 .628-3.19c0-4.675-3.841-8.506-8.53-8.506zm0 3.987a4.5 4.5 0 0 1 4.532 4.52 4.5 4.5 0 0 1-4.532 4.521 4.5 4.5 0 0 1-4.534-4.52 4.5 4.5 0 0 1 4.533-4.52z"/>
    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="6"
          stroke-width="5" d="M8.97 53.509 4.423 19.145 35.698 4.199l23.88 25.127L43.06 59.801Z"/>
</svg>
`, Hp = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <ellipse cx="4.907" cy="-32.051" fill="none" stroke="currentColor" stroke-dasharray="13.7543, 6.87718"
             stroke-width="5.489" rx="20.4" ry="13.713" transform="matrix(-.71127 .70292 -.86047 -.5095 0 0)"/>
    <path fill="currentColor"
          d="M34.597 25.275a1.934 1.934 0 0 0-2.04 2.165l2.922 31.37c.188 1.523 1.989 2.235 3.165 1.249l6.169-5.004 2.765 4.79c1.59 2.756 4.115 3.431 6.87 1.841 2.756-1.59 3.433-4.114 1.841-6.87l-2.755-4.773 7.31-2.803c1.443-.525 1.728-2.44.503-3.365L35.64 25.66a1.93 1.93 0 0 0-1.042-.383z"/>
</svg>
`, Jp = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <path fill="currentColor"
          d="M1.947 25.554c-2.176 3.77-.867 8.656 2.903 10.832 2.126 1.229 4.607 1.346 6.757.539l8.252 12.152a7.79 7.79 0 0 0-.701 1.005c-2.176 3.77-.867 8.656 2.903 10.833 3.77 2.177 8.655.867 10.832-2.903 2.1-3.64.93-8.294-2.543-10.572a2.211 2.211 0 0 0-.36-.26 2.211 2.211 0 0 0-.404-.181 7.955 7.955 0 0 0-6.086-.432l-8.348-12.292c.19-.252.369-.512.53-.79 1.457-2.526 1.339-5.537-.03-7.907l8.202-8.256c3.494 1.335 7.562.025 9.575-3.229l13.899 2.913c.266 2.435 1.634 4.721 3.899 6.03 3.77 2.176 8.655.866 10.832-2.904 2.101-3.64.93-8.294-2.543-10.572a2.211 2.211 0 0 0-.36-.26 2.211 2.211 0 0 0-.403-.181c-3.71-1.87-8.328-.556-10.429 3.083-.084.147-.155.297-.228.446l-13.5-2.83c-.053-2.55-1.329-5.023-3.58-6.499a2.211 2.211 0 0 0-.358-.259 2.211 2.211 0 0 0-.405-.181c-3.708-1.87-8.326-.556-10.428 3.083-1.61 2.79-1.307 6.19.486 8.652l-7.84 7.892a2.211 2.211 0 0 0-.094-.036c-3.71-1.87-8.328-.556-10.429 3.084zm3.83 2.211a3.473 3.473 0 0 1 4.79-1.282 3.472 3.472 0 0 1 1.284 4.789 3.473 3.473 0 0 1-4.79 1.284 3.475 3.475 0 0 1-1.283-4.79ZM23.656 8.173a3.474 3.474 0 0 1 4.79-1.283 3.472 3.472 0 0 1 1.283 4.79 3.473 3.473 0 0 1-4.789 1.284 3.475 3.475 0 0 1-1.284-4.791zm-.666 44.12a3.474 3.474 0 0 1 4.79-1.283 3.472 3.472 0 0 1 1.283 4.79 3.473 3.473 0 0 1-4.79 1.284 3.475 3.475 0 0 1-1.283-4.791zm29.166-37.88a3.474 3.474 0 0 1 4.79-1.283 3.472 3.472 0 0 1 1.283 4.79 3.473 3.473 0 0 1-4.79 1.284 3.475 3.475 0 0 1-1.283-4.791z"/>
    <path fill="currentColor"
          d="M12.9 13.516c-.63.177-.685.37-.88.95l-1.069 3.18 2.995 1.006.844-2.506 2.074-.882-1.236-2.908zm19.209 5.25 4.378 4.554 2.277-2.19-4.379-4.554zm8.132 3.106 1.441 2.812 5.623-2.882-1.441-2.812zM5.448 46.082l3.144.304.608-6.29-3.145-.303zm4.623 3.728 5.762 2.592 1.297-2.88-5.762-2.593z"/>
</svg>
`, Vp = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <path fill="currentColor"
          d="M1.717 38.645a2.675 2.668 79.7 0 0-.307 3.769L16.754 60.55a2.675 2.668 79.7 0 0 3.76.312l41.769-35.508a2.675 2.668 79.7 0 0 .307-3.769L47.246 3.45a2.675 2.668 79.7 0 0-3.76-.312zm5.486 2.352 37.702-32.05 11.892 14.056-2.717 2.31-4.458-5.269-2.033 1.729 4.457 5.269-3.11 2.643-4.457-5.268-2.034 1.728 4.458 5.27-3.106 2.64-4.458-5.27-2.033 1.73 4.457 5.268-3.11 2.644-6.194-7.32-2.033 1.728 6.193 7.32-3.11 2.645-4.457-5.269-2.034 1.729 4.458 5.268-3.106 2.64-4.458-5.268-2.033 1.73 4.457 5.268-3.11 2.643-4.457-5.268-2.034 1.729 4.458 5.268-2.098 1.783z"/>
</svg>
`, Xp = `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 64 64">
    <path d="M7.839 34.833c-7.104-9.763-5.332-23.33 4.2-30.266C21.572-2.369 35.03.123 42.13 9.882L56.166 29.17c7.098 9.755 5.329 23.325-4.204 30.262-9.533 6.936-22.989 4.444-30.09-5.315L7.841 34.836Zm5.063-25.476c-6.079 5.766-7.006 15.598-1.634 22.98l.778 1.07 12.002-8.732zm3.43-2.495L27.476 22.18l12.002-8.733-.781-1.073c-5.37-7.38-15.01-9.522-22.367-5.512m25.643 10.014L14.54 36.836l10.762 14.79c5.818 7.997 16.653 9.842 24.163 4.378 7.51-5.465 9.088-16.342 3.267-24.342z"/>
</svg>
`, Wp = `\uFEFF<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <path fill="currentColor"
          d="M42.012 2.106a4.092 4.092 0 0 0-5.741.735 4.092 4.092 0 0 0 .572 5.607L23.964 23.45a8.185 8.185 0 0 0-10.458 2.142l5.18 4.005 5.454 4.218L7.87 59.22a1.124 7.304 37.712 0 0 1.54 1.19l20.494-22.138 5.454 4.217 5.18 4.005a8.185 8.185 0 0 0-.558-10.66l11.277-16.24a4.092 4.092 0 0 0 5.572-.858 4.092 4.092 0 0 0-.735-5.74z"/>
</svg>
`, Zp = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <g fill="currentColor" stroke="currentColor">
        <path d="m37.62 5.028-.337.284-4.039 4.068 3.547 3.523L39.875 9.8l2.846.596 1.025-4.893-4.176-.877Zm9.995 6.393 9.787 2.053 1.026-4.895-9.787-2.05zm14.68 3.078 9.787 2.05 1.025-4.892-9.787-2.053zm-39.623 5.522 3.547 3.523 7.049-7.094-3.547-3.523zm-10.57 10.642 3.546 3.524 7.047-7.094-3.547-3.524zM1.529 41.306l3.55 3.523 7.046-7.096-3.547-3.523Zm70.977 4.027 3.91 3.115 3.44-4.387-1.118-6.55zM.947 48.319l5.617 8.274 4.137-2.809-5.617-8.273Zm62.211 8.744 3.91 3.116 6.233-7.82-3.91-3.116zM9.373 60.73l5.62 8.272 4.134-2.809-5.617-8.271zm44.438 8.067 3.91 3.115 6.232-7.82-3.91-3.117zM17.8 73.138l5.617 8.273 4.137-2.808-5.617-8.274zm26.662 7.388 3.91 3.116 6.232-7.82-3.91-3.116zm-18.236 5.022 5.617 8.273 4.136-2.81-5.617-8.272zm8.888 6.709 3.91 3.117 6.233-7.822-3.91-3.115z"
              stroke-width="3"
              transform="translate(2.517 1.586) scale(.60827)"/>
        <path d="M22.672 20.02a3.5 3.5 0 0 0-2.506 1.034L-.514 41.872a3.5 3.5 0 0 0-.412 4.434L18 74.176a3.5 3.5 0 0 0 5.633.216l33.494-42.038a3.5 3.5 0 0 0-2.018-5.605l-31.742-6.654a3.5 3.5 0 0 0-.695-.074zm1.121 7.317 24.32 5.098-26.992 33.877L6.484 44.759Z"
              stroke-width="3"
              transform="translate(2.517 1.586) scale(.60827)"/>
        <path d="m78.734 7.668 2.61 11.396-18.145 4.154 2.705 11.816L84.05 30.88l2.609 11.396L100 21.011Z"
              stroke-width="3"
              transform="translate(1.586 1.586) scale(.60827)"/>
    </g>
</svg>
`, jp = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <path fill="currentColor" fill-rule="evenodd"
          d="M19.435 3.417c-4.478 0-8.96 1.693-12.343 5.076-6.766 6.766-6.766 17.913 0 24.679h.006c2.754 2.749 5.563 5.561 8.357 8.357 1.857 1.859 3.696 3.696 5.553 5.553l.949.949 1.892 1.898 9.496-9.49-1.898-1.898-6.502-6.502c-2.796-2.797-5.6-5.606-8.363-8.362-1.65-1.653-1.652-4.042 0-5.694 1.653-1.653 4.047-1.653 5.7 0l8.357 8.362 6.502 6.502 1.898 1.893 9.49-9.49-1.893-1.893-6.507-6.502-8.357-8.362c-3.384-3.383-7.86-5.076-12.337-5.076Zm0 2.68c3.789 0 7.577 1.432 10.439 4.294l8.357 8.362-5.694 5.694-8.357-8.362a6.7 6.7 0 0 0-9.496 0 6.697 6.697 0 0 0 0 9.49c2.76 2.755 5.566 5.564 8.363 8.362l-5.694 5.694c-2.795-2.796-5.601-5.607-8.357-8.357H8.99c-5.724-5.724-5.724-15.16 0-20.883 2.861-2.862 6.655-4.294 10.444-4.294ZM57.709 29.03a4.266 4.266 0 0 0-4.268 4.268c0 1.594.881 2.973 2.176 3.707-.714 4.997-1.424 10.107-2.176 15.037-.934 0-1.792.309-2.495.818l-7.115-5.07a4.25 4.25 0 0 0 .115-.965 4.27 4.27 0 1 0-4.268 4.268 4.23 4.23 0 0 0 2.732-1.012l6.973 4.965a4.22 4.22 0 0 0-.215 1.269 4.27 4.27 0 0 0 4.273 4.268 4.266 4.266 0 0 0 4.268-4.268 4.247 4.247 0 0 0-1.657-3.356l2.208-15.446c2.095-.273 3.722-2.045 3.722-4.215a4.27 4.27 0 0 0-4.273-4.268z"
    />
</svg>
`, $p = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <g fill="currentColor">
        <path d="m4.879 2.684-2.832 2.8L7.65 11.15l2.832-2.801Zm8.403 8.495-2.832 2.802 5.603 5.662 2.831-2.802zm8.404 8.494-2.832 2.8 5.602 5.664 2.832-2.802z"
        />
        <path d="M27.814 7.408a3.576 3.576 0 0 0-1.161-.176 3.2 3.2 0 0 0-.878.138l7.963 26.068L7.18 27.3c-.543 2.352 1.67 6.055 4.962 6.816l23.054 5.297 2.326 6.42c-2.27-.175-4.279 1.912-4.908 3.805-.535 1.698-.512 3.656.085 5.61.597 1.954 1.671 3.59 3.064 4.7 1.393 1.11 3.238 1.71 5.023 1.164 8.064-3.039 2.135-15.793.467-20.58 5.917 1.023 18.77 5.88 20.578-1.979.42-1.819-.306-3.616-1.509-4.929-1.203-1.313-2.909-2.27-4.9-2.73-1.99-.46-3.866-.547-5.602.303-1.737.849-3.768 2.642-3.468 4.73a6.17 6.17 0 0 0 .012.43l-6.563-1.794-6.88-22.632c-.702-2.297-3.445-3.99-5.108-4.523Zm26.824 26.88c1.36.315 2.472.99 3.116 1.692.644.703.795 1.307.684 1.79-.112.482-.511.956-1.399 1.305-.887.348-2.182.467-3.542.152-1.361-.314-2.472-.99-3.116-1.693-.644-.703-.797-1.304-.686-1.787.112-.482.513-.956 1.4-1.305a5.198 5.198 0 0 1 1.594-.327 6.98 6.98 0 0 1 1.949.173zM37.846 49.174c.333.069.71.25 1.13.585.746.594 1.497 1.654 1.905 2.99.408 1.335.379 2.635.092 3.545-.287.91-.731 1.34-1.205 1.484-.473.145-1.085.036-1.831-.558-.746-.594-1.496-1.655-1.904-2.99-.407-1.336-.378-2.637-.092-3.546.287-.91.732-1.342 1.206-1.486.118-.036.245-.057.38-.058.102 0 .207.011.319.034z"
        />
    </g>
</svg>
`, Kp = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <path fill="currentColor"
          d="M41.233 7.917c-5.5 0-10.519 2.077-14.328 5.482a21.443 21.443 0 0 0-4.138-.404c-11.88 0-21.544 9.664-21.544 21.544s9.664 21.544 21.544 21.544c5.5 0 10.519-2.077 14.328-5.482 1.34.263 2.722.404 4.138.404 11.88 0 21.544-9.664 21.544-21.544S53.113 7.917 41.233 7.917zm-9.969 6.791a21.61 21.61 0 0 1 5.598 3.499l-2.01 2.33a18.557 18.557 0 0 0-4.8-2.999Zm-7.927 2.765 2.557 1.714a18.558 18.558 0 0 0-2.396 5.128l-2.955-.86a21.614 21.614 0 0 1 2.794-5.982zm15.86 3.08a21.413 21.413 0 0 1 3.46 5.628l-2.839 1.188a18.357 18.357 0 0 0-2.963-4.817zm-19.334 6.142 3.053.399a18.348 18.348 0 0 0 .144 5.654l-3.027.552a21.407 21.407 0 0 1-.17-6.605Zm23.834 2.63a21.81 21.81 0 0 1 .548 3.263c.1 1.1.115 2.207.044 3.31l-3.07-.195c.12-1.888-.056-3.8-.511-5.64zm-19.918 6.172a18.37 18.37 0 0 0 2.64 5.003l-2.466 1.84a21.427 21.427 0 0 1-3.083-5.84Zm17.042 3.016 3.004.666a21.486 21.486 0 0 1-2.404 6.15l-2.66-1.547a18.434 18.434 0 0 0 2.06-5.27zm-12.535 4.124a18.554 18.554 0 0 0 4.6 3.302l-1.392 2.744a21.611 21.611 0 0 1-5.363-3.85Z"/>
</svg>
`, Qp = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <path fill="currentColor"
          d="M1.585 1.585V13.75h5.17v1.52H8.58v-1.52h5.17V1.585Zm3.041 3.041h6.083v6.083H4.626Zm9.429 2.13V8.58h3.65V6.755Zm5.475 0V8.58h3.65V6.755Zm5.474 0V8.58h3.65V6.755Zm5.475 0V8.58h3.65V6.755Zm5.475 0V8.58h3.65V6.755Zm5.475 0v1.597a1.521 1.521 0 0 0-.325.152l-15.686 9.758a1.52 1.52 0 0 0-.199 2.437l23.512 20.553a1.52 1.52 0 0 0 2.477-.78l4.212-17.037v.352h1.825v-3.65H55.42v1.524a1.52 1.52 0 0 0-.222-.296L43.002 8.741a1.521 1.521 0 0 0-.182-.16h2.259V6.754Zm5.475 0V8.58h3.65V6.755Zm5.474 0V8.58h3.65V6.755Zm3.042 2.432v3.65h1.825v-3.65Zm-13.752 2.549 10.757 11.137-3.57 14.446-20.087-17.559Zm13.752 2.926v3.65h1.825v-3.65ZM6.755 17.096v3.65H8.58v-3.65zm0 5.475v3.65h1.628a1.52 1.52 0 0 0 1.02.909l12.683 3.406 7.905 12.694c.168.27.417.481.712.602l13.39 4.576a1.52 1.52 0 0 0 1.157-2.814l-12.936-4.389L24.35 28.42a1.52 1.52 0 0 0-.896-.664L10.19 24.193a1.52 1.52 0 0 0-1.61.557v-2.178zm48.665 3.042v3.65h1.825v-3.65ZM6.755 28.046v3.65H8.58v-3.65zm48.665 3.042v3.65h1.825v-3.65ZM6.755 33.52v3.65H8.58v-3.65zm48.665 3.041v3.65h1.825v-3.65ZM6.755 38.996v3.65H8.58v-3.65zm48.665 3.041v3.65h1.825v-3.65zm-35.382.913c-3.454 0-6.287 2.833-6.287 6.287 0 3.076 2.248 5.654 5.179 6.183h-1.225v1.825h3.65V55.42h-.206c2.712-.5 4.777-2.796 5.055-5.59l.002-.002a1.52 1.52 0 0 0 0-1.18c-.314-3.168-2.922-5.698-6.168-5.698zM6.755 44.47v3.65H8.58v-3.65zm13.283 1.521a3.223 3.223 0 0 1 3.246 3.246 3.223 3.223 0 0 1-3.246 3.246 3.223 3.223 0 0 1-3.246-3.246 3.223 3.223 0 0 1 3.246-3.246zm35.382 1.52v2.738h-5.17v12.166h12.165V50.25h-5.17v-2.737ZM6.755 49.946v3.65H8.58v-3.65zm46.536 3.346h6.083v6.083H53.29ZM6.755 55.42v1.825h3.65V55.42H7.668Zm5.475 0v1.825h3.65V55.42zm10.95 0v1.825h3.65V55.42zm5.474 0v1.825h3.65V55.42zm5.475 0v1.825h3.65V55.42zm5.475 0v1.825h3.65V55.42zm5.475 0v1.825h3.65V55.42z"/>
</svg>
`, Mt = {
  marker: Cp,
  circle: bp,
  circle_marker: lf,
  text_marker: Dp,
  line: Lp,
  rectangle: Np,
  polygon: Ap,
  freehand: qp,
  custom_shape: Bp,
  drag: Tp,
  change: Ip,
  rotate: Pp,
  scale: Zp,
  copy: Gp,
  cut: Up,
  split: $p,
  delete: Op,
  union: Kp,
  difference: zp,
  line_simplification: Jp,
  lasso: Hp,
  shape_markers: null,
  snapping: jp,
  pin: Wp,
  snap_guides: Rp,
  measurements: Vp,
  auto_trace: Fp,
  geofencing: Yp,
  zoom_to_features: Qp,
  click_to_edit: Xp
}, em = [
  "mode_start",
  "mode_started",
  "mode_end",
  "mode_ended"
], ft = (n) => Object.keys(n), ji = (n) => Object.values(n), Ir = (n, r) => r.includes(n);
function cf(n) {
  return n && n.__esModule && Object.prototype.hasOwnProperty.call(n, "default") ? n.default : n;
}
var js = { exports: {} }, tm = js.exports, ec;
function nm() {
  return ec || (ec = 1, function(n) {
    (function(r, e) {
      n.exports ? n.exports = e() : r.log = e();
    })(tm, function() {
      var r = function() {
      }, e = "undefined", s = typeof window !== e && typeof window.navigator !== e && /Trident\/|MSIE /.test(window.navigator.userAgent), u = [
        "trace",
        "debug",
        "info",
        "warn",
        "error"
      ], c = {}, f = null;
      function h(D, q) {
        var G = D[q];
        if (typeof G.bind == "function")
          return G.bind(D);
        try {
          return Function.prototype.bind.call(G, D);
        } catch {
          return function() {
            return Function.prototype.apply.apply(G, [D, arguments]);
          };
        }
      }
      function m() {
        console.log && (console.log.apply ? console.log.apply(console, arguments) : Function.prototype.apply.apply(console.log, [console, arguments])), console.trace && console.trace();
      }
      function d(D) {
        return D === "debug" && (D = "log"), typeof console === e ? !1 : D === "trace" && s ? m : console[D] !== void 0 ? h(console, D) : console.log !== void 0 ? h(console, "log") : r;
      }
      function y() {
        for (var D = this.getLevel(), q = 0; q < u.length; q++) {
          var G = u[q];
          this[G] = q < D ? r : this.methodFactory(G, D, this.name);
        }
        if (this.log = this.debug, typeof console === e && D < this.levels.SILENT)
          return "No console available for logging";
      }
      function _(D) {
        return function() {
          typeof console !== e && (y.call(this), this[D].apply(this, arguments));
        };
      }
      function E(D, q, G) {
        return d(D) || _.apply(this, arguments);
      }
      function S(D, q) {
        var G = this, M, H, V, X = "loglevel";
        typeof D == "string" ? X += ":" + D : typeof D == "symbol" && (X = void 0);
        function j(L) {
          var A = (u[L] || "silent").toUpperCase();
          if (!(typeof window === e || !X)) {
            try {
              window.localStorage[X] = A;
              return;
            } catch {
            }
            try {
              window.document.cookie = encodeURIComponent(X) + "=" + A + ";";
            } catch {
            }
          }
        }
        function $() {
          var L;
          if (!(typeof window === e || !X)) {
            try {
              L = window.localStorage[X];
            } catch {
            }
            if (typeof L === e)
              try {
                var A = window.document.cookie, F = encodeURIComponent(X), O = A.indexOf(F + "=");
                O !== -1 && (L = /^([^;]+)/.exec(
                  A.slice(O + F.length + 1)
                )[1]);
              } catch {
              }
            return G.levels[L] === void 0 && (L = void 0), L;
          }
        }
        function x() {
          if (!(typeof window === e || !X)) {
            try {
              window.localStorage.removeItem(X);
            } catch {
            }
            try {
              window.document.cookie = encodeURIComponent(X) + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
            } catch {
            }
          }
        }
        function k(L) {
          var A = L;
          if (typeof A == "string" && G.levels[A.toUpperCase()] !== void 0 && (A = G.levels[A.toUpperCase()]), typeof A == "number" && A >= 0 && A <= G.levels.SILENT)
            return A;
          throw new TypeError("log.setLevel() called with invalid level: " + L);
        }
        G.name = D, G.levels = {
          TRACE: 0,
          DEBUG: 1,
          INFO: 2,
          WARN: 3,
          ERROR: 4,
          SILENT: 5
        }, G.methodFactory = q || E, G.getLevel = function() {
          return V ?? H ?? M;
        }, G.setLevel = function(L, A) {
          return V = k(L), A !== !1 && j(V), y.call(G);
        }, G.setDefaultLevel = function(L) {
          H = k(L), $() || G.setLevel(L, !1);
        }, G.resetLevel = function() {
          V = null, x(), y.call(G);
        }, G.enableAll = function(L) {
          G.setLevel(G.levels.TRACE, L);
        }, G.disableAll = function(L) {
          G.setLevel(G.levels.SILENT, L);
        }, G.rebuild = function() {
          if (f !== G && (M = k(f.getLevel())), y.call(G), f === G)
            for (var L in c)
              c[L].rebuild();
        }, M = k(
          f ? f.getLevel() : "WARN"
        );
        var T = $();
        T != null && (V = k(T)), y.call(G);
      }
      f = new S(), f.getLogger = function(q) {
        if (typeof q != "symbol" && typeof q != "string" || q === "")
          throw new TypeError("You must supply a name when creating a logger.");
        var G = c[q];
        return G || (G = c[q] = new S(
          q,
          f.methodFactory
        )), G;
      };
      var I = typeof window !== e ? window.log : void 0;
      return f.noConflict = function() {
        return typeof window !== e && window.log === f && (window.log = I), f;
      }, f.getLoggers = function() {
        return c;
      }, f.default = f, f;
    });
  }(js)), js.exports;
}
var rm = nm();
const ae = /* @__PURE__ */ cf(rm);
class Su {
  isMarkerInstanceAvailable() {
    return this.markerInstance ? !0 : (ae.error("Marker instance is not available"), !1);
  }
}
var nt = 63710088e-1, hf = {
  centimeters: nt * 100,
  centimetres: nt * 100,
  degrees: 360 / (2 * Math.PI),
  feet: nt * 3.28084,
  inches: nt * 39.37,
  kilometers: nt / 1e3,
  kilometres: nt / 1e3,
  meters: nt,
  metres: nt,
  miles: nt / 1609.344,
  millimeters: nt * 1e3,
  millimetres: nt * 1e3,
  nauticalmiles: nt / 1852,
  radians: 1,
  yards: nt * 1.0936
};
function cn(n, r, e = {}) {
  const s = { type: "Feature" };
  return (e.id === 0 || e.id) && (s.id = e.id), e.bbox && (s.bbox = e.bbox), s.properties = r || {}, s.geometry = n, s;
}
function Un(n, r, e = {}) {
  if (!n)
    throw new Error("coordinates is required");
  if (!Array.isArray(n))
    throw new Error("coordinates must be an Array");
  if (n.length < 2)
    throw new Error("coordinates must be at least 2 numbers long");
  if (!tc(n[0]) || !tc(n[1]))
    throw new Error("coordinates must contain numbers");
  return cn({
    type: "Point",
    coordinates: n
  }, r, e);
}
function or(n, r, e = {}) {
  for (const u of n) {
    if (u.length < 4)
      throw new Error(
        "Each LinearRing of a Polygon must have 4 or more Positions."
      );
    if (u[u.length - 1].length !== u[0].length)
      throw new Error("First and last Position are not equivalent.");
    for (let c = 0; c < u[u.length - 1].length; c++)
      if (u[u.length - 1][c] !== u[0][c])
        throw new Error("First and last Position are not equivalent.");
  }
  return cn({
    type: "Polygon",
    coordinates: n
  }, r, e);
}
function ls(n, r, e = {}) {
  if (n.length < 2)
    throw new Error("coordinates must be an array of two or more positions");
  return cn({
    type: "LineString",
    coordinates: n
  }, r, e);
}
function Ke(n, r = {}) {
  const e = { type: "FeatureCollection" };
  return r.id && (e.id = r.id), r.bbox && (e.bbox = r.bbox), e.features = n, e;
}
function im(n, r, e = {}) {
  return cn({
    type: "MultiLineString",
    coordinates: n
  }, r, e);
}
function Mu(n, r, e = {}) {
  return cn({
    type: "MultiPolygon",
    coordinates: n
  }, r, e);
}
function Iu(n, r = "kilometers") {
  const e = hf[r];
  if (!e)
    throw new Error(r + " units is invalid");
  return n * e;
}
function bu(n, r = "kilometers") {
  const e = hf[r];
  if (!e)
    throw new Error(r + " units is invalid");
  return n / e;
}
function oi(n) {
  return n % (2 * Math.PI) * 180 / Math.PI;
}
function rt(n) {
  return n % 360 * Math.PI / 180;
}
function ff(n, r = "kilometers", e = "kilometers") {
  if (!(n >= 0))
    throw new Error("length must be a positive number");
  return Iu(bu(n, r), e);
}
function tc(n) {
  return !isNaN(n) && n !== null && !Array.isArray(n);
}
function Tu(n) {
  return n !== null && typeof n == "object" && !Array.isArray(n);
}
function fr(n, r, e) {
  if (n !== null)
    for (var s, u, c, f, h, m, d, y = 0, _ = 0, E, S = n.type, I = S === "FeatureCollection", D = S === "Feature", q = I ? n.features.length : 1, G = 0; G < q; G++) {
      d = I ? n.features[G].geometry : D ? n.geometry : n, E = d ? d.type === "GeometryCollection" : !1, h = E ? d.geometries.length : 1;
      for (var M = 0; M < h; M++) {
        var H = 0, V = 0;
        if (f = E ? d.geometries[M] : d, f !== null) {
          m = f.coordinates;
          var X = f.type;
          switch (y = e && (X === "Polygon" || X === "MultiPolygon") ? 1 : 0, X) {
            case null:
              break;
            case "Point":
              if (r(
                m,
                _,
                G,
                H,
                V
              ) === !1)
                return !1;
              _++, H++;
              break;
            case "LineString":
            case "MultiPoint":
              for (s = 0; s < m.length; s++) {
                if (r(
                  m[s],
                  _,
                  G,
                  H,
                  V
                ) === !1)
                  return !1;
                _++, X === "MultiPoint" && H++;
              }
              X === "LineString" && H++;
              break;
            case "Polygon":
            case "MultiLineString":
              for (s = 0; s < m.length; s++) {
                for (u = 0; u < m[s].length - y; u++) {
                  if (r(
                    m[s][u],
                    _,
                    G,
                    H,
                    V
                  ) === !1)
                    return !1;
                  _++;
                }
                X === "MultiLineString" && H++, X === "Polygon" && V++;
              }
              X === "Polygon" && H++;
              break;
            case "MultiPolygon":
              for (s = 0; s < m.length; s++) {
                for (V = 0, u = 0; u < m[s].length; u++) {
                  for (c = 0; c < m[s][u].length - y; c++) {
                    if (r(
                      m[s][u][c],
                      _,
                      G,
                      H,
                      V
                    ) === !1)
                      return !1;
                    _++;
                  }
                  V++;
                }
                H++;
              }
              break;
            case "GeometryCollection":
              for (s = 0; s < f.geometries.length; s++)
                if (fr(f.geometries[s], r, e) === !1)
                  return !1;
              break;
            default:
              throw new Error("Unknown Geometry Type");
          }
        }
      }
    }
}
function Tn(n, r) {
  if (n.type === "Feature")
    r(n, 0);
  else if (n.type === "FeatureCollection")
    for (var e = 0; e < n.features.length && r(n.features[e], e) !== !1; e++)
      ;
}
function sm(n, r, e) {
  var s = e;
  return Tn(n, function(u, c) {
    c === 0 && e === void 0 ? s = u : s = r(s, u, c);
  }), s;
}
function gr(n, r) {
  var e, s, u, c, f, h, m, d, y, _, E = 0, S = n.type === "FeatureCollection", I = n.type === "Feature", D = S ? n.features.length : 1;
  for (e = 0; e < D; e++) {
    for (h = S ? n.features[e].geometry : I ? n.geometry : n, d = S ? n.features[e].properties : I ? n.properties : {}, y = S ? n.features[e].bbox : I ? n.bbox : void 0, _ = S ? n.features[e].id : I ? n.id : void 0, m = h ? h.type === "GeometryCollection" : !1, f = m ? h.geometries.length : 1, u = 0; u < f; u++) {
      if (c = m ? h.geometries[u] : h, c === null) {
        if (r(
          null,
          E,
          d,
          y,
          _
        ) === !1)
          return !1;
        continue;
      }
      switch (c.type) {
        case "Point":
        case "LineString":
        case "MultiPoint":
        case "Polygon":
        case "MultiLineString":
        case "MultiPolygon": {
          if (r(
            c,
            E,
            d,
            y,
            _
          ) === !1)
            return !1;
          break;
        }
        case "GeometryCollection": {
          for (s = 0; s < c.geometries.length; s++)
            if (r(
              c.geometries[s],
              E,
              d,
              y,
              _
            ) === !1)
              return !1;
          break;
        }
        default:
          throw new Error("Unknown Geometry Type");
      }
    }
    E++;
  }
}
function am(n, r, e) {
  var s = e;
  return gr(
    n,
    function(u, c, f, h, m) {
      s = r(
        s,
        u,
        c,
        f,
        h,
        m
      );
    }
  ), s;
}
function ur(n, r) {
  gr(n, function(e, s, u, c, f) {
    var h = e === null ? null : e.type;
    switch (h) {
      case null:
      case "Point":
      case "LineString":
      case "Polygon":
        return r(
          cn(e, u, { bbox: c, id: f }),
          s,
          0
        ) === !1 ? !1 : void 0;
    }
    var m;
    switch (h) {
      case "MultiPoint":
        m = "Point";
        break;
      case "MultiLineString":
        m = "LineString";
        break;
      case "MultiPolygon":
        m = "Polygon";
        break;
    }
    for (var d = 0; d < e.coordinates.length; d++) {
      var y = e.coordinates[d], _ = {
        type: m,
        coordinates: y
      };
      if (r(cn(_, u), s, d) === !1)
        return !1;
    }
  });
}
function wn(n, r = {}) {
  if (n.bbox != null && r.recompute !== !0)
    return n.bbox;
  const e = [1 / 0, 1 / 0, -1 / 0, -1 / 0];
  return fr(n, (s) => {
    e[0] > s[0] && (e[0] = s[0]), e[1] > s[1] && (e[1] = s[1]), e[2] < s[0] && (e[2] = s[0]), e[3] < s[1] && (e[3] = s[1]);
  }), e;
}
var gf = wn;
function $e(n) {
  if (!n)
    throw new Error("coord is required");
  if (!Array.isArray(n)) {
    if (n.type === "Feature" && n.geometry !== null && n.geometry.type === "Point")
      return [...n.geometry.coordinates];
    if (n.type === "Point")
      return [...n.coordinates];
  }
  if (Array.isArray(n) && n.length >= 2 && !Array.isArray(n[0]) && !Array.isArray(n[1]))
    return [...n];
  throw new Error("coord must be GeoJSON Point or an Array of numbers");
}
function Pt(n) {
  if (Array.isArray(n))
    return n;
  if (n.type === "Feature") {
    if (n.geometry !== null)
      return n.geometry.coordinates;
  } else if (n.coordinates)
    return n.coordinates;
  throw new Error(
    "coords must be GeoJSON Feature, Geometry Object or an Array"
  );
}
function _s(n) {
  return n.type === "Feature" ? n.geometry : n;
}
function nc(n, r) {
  return n.type === "FeatureCollection" ? "FeatureCollection" : n.type === "GeometryCollection" ? "GeometryCollection" : n.type === "Feature" && n.geometry !== null ? n.geometry.type : n.type;
}
function om(n, r, e, s = {}) {
  const u = $e(n), c = rt(u[0]), f = rt(u[1]), h = rt(e), m = bu(r, s.units), d = Math.asin(
    Math.sin(f) * Math.cos(m) + Math.cos(f) * Math.sin(m) * Math.cos(h)
  ), y = c + Math.atan2(
    Math.sin(h) * Math.sin(m) * Math.cos(f),
    Math.cos(m) - Math.sin(f) * Math.sin(d)
  ), _ = oi(y), E = oi(d);
  return Un([_, E], s.properties);
}
function um(n, r, e = {}) {
  const s = e.steps || 64, u = e.properties ? e.properties : !Array.isArray(n) && n.type === "Feature" && n.properties ? n.properties : {}, c = [];
  for (let f = 0; f < s; f++)
    c.push(
      om(n, r, f * -360 / s, e).geometry.coordinates
    );
  return c.push(c[0]), or([c], u);
}
var lm = um;
function on(n, r, e = {}) {
  var s = $e(n), u = $e(r), c = rt(u[1] - s[1]), f = rt(u[0] - s[0]), h = rt(s[1]), m = rt(u[1]), d = Math.pow(Math.sin(c / 2), 2) + Math.pow(Math.sin(f / 2), 2) * Math.cos(h) * Math.cos(m);
  return Iu(
    2 * Math.atan2(Math.sqrt(d), Math.sqrt(1 - d)),
    e.units
  );
}
var df = on;
function Ho(n, r = {}) {
  const e = _s(n);
  switch (!r.properties && n.type === "Feature" && (r.properties = n.properties), e.type) {
    case "Polygon":
      return pf(e, r);
    case "MultiPolygon":
      return mf(e, r);
    default:
      throw new Error("invalid poly");
  }
}
function pf(n, r = {}) {
  const s = _s(n).coordinates, u = r.properties ? r.properties : n.type === "Feature" ? n.properties : {};
  return vf(s, u);
}
function mf(n, r = {}) {
  const s = _s(n).coordinates, u = r.properties ? r.properties : n.type === "Feature" ? n.properties : {}, c = [];
  return s.forEach((f) => {
    c.push(vf(f, u));
  }), Ke(c);
}
function vf(n, r) {
  return n.length > 1 ? im(n, r) : ls(n[0], r);
}
var yf = typeof global == "object" && global && global.Object === Object && global, cm = typeof self == "object" && self && self.Object === Object && self, gn = yf || cm || Function("return this")(), Zt = gn.Symbol, _f = Object.prototype, hm = _f.hasOwnProperty, fm = _f.toString, zi = Zt ? Zt.toStringTag : void 0;
function gm(n) {
  var r = hm.call(n, zi), e = n[zi];
  try {
    n[zi] = void 0;
    var s = !0;
  } catch {
  }
  var u = fm.call(n);
  return s && (r ? n[zi] = e : delete n[zi]), u;
}
var dm = Object.prototype, pm = dm.toString;
function mm(n) {
  return pm.call(n);
}
var vm = "[object Null]", ym = "[object Undefined]", rc = Zt ? Zt.toStringTag : void 0;
function Nr(n) {
  return n == null ? n === void 0 ? ym : vm : rc && rc in Object(n) ? gm(n) : mm(n);
}
function Ln(n) {
  return n != null && typeof n == "object";
}
var _m = "[object Symbol]";
function ui(n) {
  return typeof n == "symbol" || Ln(n) && Nr(n) == _m;
}
function ri(n, r) {
  for (var e = -1, s = n == null ? 0 : n.length, u = Array(s); ++e < s; )
    u[e] = r(n[e], e, n);
  return u;
}
var vt = Array.isArray, ic = Zt ? Zt.prototype : void 0, sc = ic ? ic.toString : void 0;
function Ef(n) {
  if (typeof n == "string")
    return n;
  if (vt(n))
    return ri(n, Ef) + "";
  if (ui(n))
    return sc ? sc.call(n) : "";
  var r = n + "";
  return r == "0" && 1 / n == -1 / 0 ? "-0" : r;
}
var Em = /\s/;
function xm(n) {
  for (var r = n.length; r-- && Em.test(n.charAt(r)); )
    ;
  return r;
}
var wm = /^\s+/;
function km(n) {
  return n && n.slice(0, xm(n) + 1).replace(wm, "");
}
function Rt(n) {
  var r = typeof n;
  return n != null && (r == "object" || r == "function");
}
var ac = NaN, Sm = /^[-+]0x[0-9a-f]+$/i, Mm = /^0b[01]+$/i, Im = /^0o[0-7]+$/i, bm = parseInt;
function oc(n) {
  if (typeof n == "number")
    return n;
  if (ui(n))
    return ac;
  if (Rt(n)) {
    var r = typeof n.valueOf == "function" ? n.valueOf() : n;
    n = Rt(r) ? r + "" : r;
  }
  if (typeof n != "string")
    return n === 0 ? n : +n;
  n = km(n);
  var e = Mm.test(n);
  return e || Im.test(n) ? bm(n.slice(2), e ? 2 : 8) : Sm.test(n) ? ac : +n;
}
function Pa(n) {
  return n;
}
var Tm = "[object AsyncFunction]", Lm = "[object Function]", Cm = "[object GeneratorFunction]", Am = "[object Proxy]";
function Lu(n) {
  if (!Rt(n))
    return !1;
  var r = Nr(n);
  return r == Lm || r == Cm || r == Tm || r == Am;
}
var mo = gn["__core-js_shared__"], uc = function() {
  var n = /[^.]+$/.exec(mo && mo.keys && mo.keys.IE_PROTO || "");
  return n ? "Symbol(src)_1." + n : "";
}();
function Nm(n) {
  return !!uc && uc in n;
}
var Om = Function.prototype, Pm = Om.toString;
function Or(n) {
  if (n != null) {
    try {
      return Pm.call(n);
    } catch {
    }
    try {
      return n + "";
    } catch {
    }
  }
  return "";
}
var Rm = /[\\^$.*+?()[\]{}|]/g, Dm = /^\[object .+?Constructor\]$/, Fm = Function.prototype, Gm = Object.prototype, Bm = Fm.toString, Um = Gm.hasOwnProperty, zm = RegExp(
  "^" + Bm.call(Um).replace(Rm, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
);
function qm(n) {
  if (!Rt(n) || Nm(n))
    return !1;
  var r = Lu(n) ? zm : Dm;
  return r.test(Or(n));
}
function Ym(n, r) {
  return n == null ? void 0 : n[r];
}
function Pr(n, r) {
  var e = Ym(n, r);
  return qm(e) ? e : void 0;
}
var Jo = Pr(gn, "WeakMap"), lc = Object.create, Hm = /* @__PURE__ */ function() {
  function n() {
  }
  return function(r) {
    if (!Rt(r))
      return {};
    if (lc)
      return lc(r);
    n.prototype = r;
    var e = new n();
    return n.prototype = void 0, e;
  };
}();
function Jm(n, r, e) {
  switch (e.length) {
    case 0:
      return n.call(r);
    case 1:
      return n.call(r, e[0]);
    case 2:
      return n.call(r, e[0], e[1]);
    case 3:
      return n.call(r, e[0], e[1], e[2]);
  }
  return n.apply(r, e);
}
function Vm() {
}
function Xm(n, r) {
  var e = -1, s = n.length;
  for (r || (r = Array(s)); ++e < s; )
    r[e] = n[e];
  return r;
}
var Wm = 800, Zm = 16, jm = Date.now;
function $m(n) {
  var r = 0, e = 0;
  return function() {
    var s = jm(), u = Zm - (s - e);
    if (e = s, u > 0) {
      if (++r >= Wm)
        return arguments[0];
    } else
      r = 0;
    return n.apply(void 0, arguments);
  };
}
function Km(n) {
  return function() {
    return n;
  };
}
var ca = function() {
  try {
    var n = Pr(Object, "defineProperty");
    return n({}, "", {}), n;
  } catch {
  }
}(), Qm = ca ? function(n, r) {
  return ca(n, "toString", {
    configurable: !0,
    enumerable: !1,
    value: Km(r),
    writable: !0
  });
} : Pa, ev = $m(Qm);
function tv(n, r) {
  for (var e = -1, s = n == null ? 0 : n.length; ++e < s && r(n[e], e, n) !== !1; )
    ;
  return n;
}
function nv(n, r, e, s) {
  for (var u = n.length, c = e + -1; ++c < u; )
    if (r(n[c], c, n))
      return c;
  return -1;
}
function rv(n) {
  return n !== n;
}
function iv(n, r, e) {
  for (var s = e - 1, u = n.length; ++s < u; )
    if (n[s] === r)
      return s;
  return -1;
}
function sv(n, r, e) {
  return r === r ? iv(n, r, e) : nv(n, rv, e);
}
function xf(n, r) {
  var e = n == null ? 0 : n.length;
  return !!e && sv(n, r, 0) > -1;
}
var av = 9007199254740991, ov = /^(?:0|[1-9]\d*)$/;
function Cu(n, r) {
  var e = typeof n;
  return r = r ?? av, !!r && (e == "number" || e != "symbol" && ov.test(n)) && n > -1 && n % 1 == 0 && n < r;
}
function Ra(n, r, e) {
  r == "__proto__" && ca ? ca(n, r, {
    configurable: !0,
    enumerable: !0,
    value: e,
    writable: !0
  }) : n[r] = e;
}
function Es(n, r) {
  return n === r || n !== n && r !== r;
}
var uv = Object.prototype, lv = uv.hasOwnProperty;
function wf(n, r, e) {
  var s = n[r];
  (!(lv.call(n, r) && Es(s, e)) || e === void 0 && !(r in n)) && Ra(n, r, e);
}
function cv(n, r, e, s) {
  var u = !e;
  e || (e = {});
  for (var c = -1, f = r.length; ++c < f; ) {
    var h = r[c], m = void 0;
    m === void 0 && (m = n[h]), u ? Ra(e, h, m) : wf(e, h, m);
  }
  return e;
}
var cc = Math.max;
function hv(n, r, e) {
  return r = cc(r === void 0 ? n.length - 1 : r, 0), function() {
    for (var s = arguments, u = -1, c = cc(s.length - r, 0), f = Array(c); ++u < c; )
      f[u] = s[r + u];
    u = -1;
    for (var h = Array(r + 1); ++u < r; )
      h[u] = s[u];
    return h[r] = e(f), Jm(n, this, h);
  };
}
function Au(n, r) {
  return ev(hv(n, r, Pa), n + "");
}
var fv = 9007199254740991;
function Nu(n) {
  return typeof n == "number" && n > -1 && n % 1 == 0 && n <= fv;
}
function vi(n) {
  return n != null && Nu(n.length) && !Lu(n);
}
function Vo(n, r, e) {
  if (!Rt(e))
    return !1;
  var s = typeof r;
  return (s == "number" ? vi(e) && Cu(r, e.length) : s == "string" && r in e) ? Es(e[r], n) : !1;
}
function kf(n) {
  return Au(function(r, e) {
    var s = -1, u = e.length, c = u > 1 ? e[u - 1] : void 0, f = u > 2 ? e[2] : void 0;
    for (c = n.length > 3 && typeof c == "function" ? (u--, c) : void 0, f && Vo(e[0], e[1], f) && (c = u < 3 ? void 0 : c, u = 1), r = Object(r); ++s < u; ) {
      var h = e[s];
      h && n(r, h, s, c);
    }
    return r;
  });
}
var gv = Object.prototype;
function Ou(n) {
  var r = n && n.constructor, e = typeof r == "function" && r.prototype || gv;
  return n === e;
}
function dv(n, r) {
  for (var e = -1, s = Array(n); ++e < n; )
    s[e] = r(e);
  return s;
}
var pv = "[object Arguments]";
function hc(n) {
  return Ln(n) && Nr(n) == pv;
}
var Sf = Object.prototype, mv = Sf.hasOwnProperty, vv = Sf.propertyIsEnumerable, cs = hc(/* @__PURE__ */ function() {
  return arguments;
}()) ? hc : function(n) {
  return Ln(n) && mv.call(n, "callee") && !vv.call(n, "callee");
};
function yv() {
  return !1;
}
var Mf = typeof exports == "object" && exports && !exports.nodeType && exports, fc = Mf && typeof module == "object" && module && !module.nodeType && module, _v = fc && fc.exports === Mf, gc = _v ? gn.Buffer : void 0, Ev = gc ? gc.isBuffer : void 0, hs = Ev || yv, xv = "[object Arguments]", wv = "[object Array]", kv = "[object Boolean]", Sv = "[object Date]", Mv = "[object Error]", Iv = "[object Function]", bv = "[object Map]", Tv = "[object Number]", Lv = "[object Object]", Cv = "[object RegExp]", Av = "[object Set]", Nv = "[object String]", Ov = "[object WeakMap]", Pv = "[object ArrayBuffer]", Rv = "[object DataView]", Dv = "[object Float32Array]", Fv = "[object Float64Array]", Gv = "[object Int8Array]", Bv = "[object Int16Array]", Uv = "[object Int32Array]", zv = "[object Uint8Array]", qv = "[object Uint8ClampedArray]", Yv = "[object Uint16Array]", Hv = "[object Uint32Array]", ze = {};
ze[Dv] = ze[Fv] = ze[Gv] = ze[Bv] = ze[Uv] = ze[zv] = ze[qv] = ze[Yv] = ze[Hv] = !0;
ze[xv] = ze[wv] = ze[Pv] = ze[kv] = ze[Rv] = ze[Sv] = ze[Mv] = ze[Iv] = ze[bv] = ze[Tv] = ze[Lv] = ze[Cv] = ze[Av] = ze[Nv] = ze[Ov] = !1;
function Jv(n) {
  return Ln(n) && Nu(n.length) && !!ze[Nr(n)];
}
function Da(n) {
  return function(r) {
    return n(r);
  };
}
var If = typeof exports == "object" && exports && !exports.nodeType && exports, is = If && typeof module == "object" && module && !module.nodeType && module, Vv = is && is.exports === If, vo = Vv && yf.process, li = function() {
  try {
    var n = is && is.require && is.require("util").types;
    return n || vo && vo.binding && vo.binding("util");
  } catch {
  }
}(), dc = li && li.isTypedArray, Pu = dc ? Da(dc) : Jv, Xv = Object.prototype, Wv = Xv.hasOwnProperty;
function bf(n, r) {
  var e = vt(n), s = !e && cs(n), u = !e && !s && hs(n), c = !e && !s && !u && Pu(n), f = e || s || u || c, h = f ? dv(n.length, String) : [], m = h.length;
  for (var d in n)
    (r || Wv.call(n, d)) && !(f && // Safari 9 has enumerable `arguments.length` in strict mode.
    (d == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
    u && (d == "offset" || d == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
    c && (d == "buffer" || d == "byteLength" || d == "byteOffset") || // Skip index properties.
    Cu(d, m))) && h.push(d);
  return h;
}
function Tf(n, r) {
  return function(e) {
    return n(r(e));
  };
}
var Zv = Tf(Object.keys, Object), jv = Object.prototype, $v = jv.hasOwnProperty;
function Kv(n) {
  if (!Ou(n))
    return Zv(n);
  var r = [];
  for (var e in Object(n))
    $v.call(n, e) && e != "constructor" && r.push(e);
  return r;
}
function Fa(n) {
  return vi(n) ? bf(n) : Kv(n);
}
function Qv(n) {
  var r = [];
  if (n != null)
    for (var e in Object(n))
      r.push(e);
  return r;
}
var ey = Object.prototype, ty = ey.hasOwnProperty;
function ny(n) {
  if (!Rt(n))
    return Qv(n);
  var r = Ou(n), e = [];
  for (var s in n)
    s == "constructor" && (r || !ty.call(n, s)) || e.push(s);
  return e;
}
function Lf(n) {
  return vi(n) ? bf(n, !0) : ny(n);
}
var ry = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, iy = /^\w*$/;
function Ru(n, r) {
  if (vt(n))
    return !1;
  var e = typeof n;
  return e == "number" || e == "symbol" || e == "boolean" || n == null || ui(n) ? !0 : iy.test(n) || !ry.test(n) || r != null && n in Object(r);
}
var fs = Pr(Object, "create");
function sy() {
  this.__data__ = fs ? fs(null) : {}, this.size = 0;
}
function ay(n) {
  var r = this.has(n) && delete this.__data__[n];
  return this.size -= r ? 1 : 0, r;
}
var oy = "__lodash_hash_undefined__", uy = Object.prototype, ly = uy.hasOwnProperty;
function cy(n) {
  var r = this.__data__;
  if (fs) {
    var e = r[n];
    return e === oy ? void 0 : e;
  }
  return ly.call(r, n) ? r[n] : void 0;
}
var hy = Object.prototype, fy = hy.hasOwnProperty;
function gy(n) {
  var r = this.__data__;
  return fs ? r[n] !== void 0 : fy.call(r, n);
}
var dy = "__lodash_hash_undefined__";
function py(n, r) {
  var e = this.__data__;
  return this.size += this.has(n) ? 0 : 1, e[n] = fs && r === void 0 ? dy : r, this;
}
function Lr(n) {
  var r = -1, e = n == null ? 0 : n.length;
  for (this.clear(); ++r < e; ) {
    var s = n[r];
    this.set(s[0], s[1]);
  }
}
Lr.prototype.clear = sy;
Lr.prototype.delete = ay;
Lr.prototype.get = cy;
Lr.prototype.has = gy;
Lr.prototype.set = py;
function my() {
  this.__data__ = [], this.size = 0;
}
function Ga(n, r) {
  for (var e = n.length; e--; )
    if (Es(n[e][0], r))
      return e;
  return -1;
}
var vy = Array.prototype, yy = vy.splice;
function _y(n) {
  var r = this.__data__, e = Ga(r, n);
  if (e < 0)
    return !1;
  var s = r.length - 1;
  return e == s ? r.pop() : yy.call(r, e, 1), --this.size, !0;
}
function Ey(n) {
  var r = this.__data__, e = Ga(r, n);
  return e < 0 ? void 0 : r[e][1];
}
function xy(n) {
  return Ga(this.__data__, n) > -1;
}
function wy(n, r) {
  var e = this.__data__, s = Ga(e, n);
  return s < 0 ? (++this.size, e.push([n, r])) : e[s][1] = r, this;
}
function Vn(n) {
  var r = -1, e = n == null ? 0 : n.length;
  for (this.clear(); ++r < e; ) {
    var s = n[r];
    this.set(s[0], s[1]);
  }
}
Vn.prototype.clear = my;
Vn.prototype.delete = _y;
Vn.prototype.get = Ey;
Vn.prototype.has = xy;
Vn.prototype.set = wy;
var gs = Pr(gn, "Map");
function ky() {
  this.size = 0, this.__data__ = {
    hash: new Lr(),
    map: new (gs || Vn)(),
    string: new Lr()
  };
}
function Sy(n) {
  var r = typeof n;
  return r == "string" || r == "number" || r == "symbol" || r == "boolean" ? n !== "__proto__" : n === null;
}
function Ba(n, r) {
  var e = n.__data__;
  return Sy(r) ? e[typeof r == "string" ? "string" : "hash"] : e.map;
}
function My(n) {
  var r = Ba(this, n).delete(n);
  return this.size -= r ? 1 : 0, r;
}
function Iy(n) {
  return Ba(this, n).get(n);
}
function by(n) {
  return Ba(this, n).has(n);
}
function Ty(n, r) {
  var e = Ba(this, n), s = e.size;
  return e.set(n, r), this.size += e.size == s ? 0 : 1, this;
}
function Xn(n) {
  var r = -1, e = n == null ? 0 : n.length;
  for (this.clear(); ++r < e; ) {
    var s = n[r];
    this.set(s[0], s[1]);
  }
}
Xn.prototype.clear = ky;
Xn.prototype.delete = My;
Xn.prototype.get = Iy;
Xn.prototype.has = by;
Xn.prototype.set = Ty;
var Ly = "Expected a function";
function Du(n, r) {
  if (typeof n != "function" || r != null && typeof r != "function")
    throw new TypeError(Ly);
  var e = function() {
    var s = arguments, u = r ? r.apply(this, s) : s[0], c = e.cache;
    if (c.has(u))
      return c.get(u);
    var f = n.apply(this, s);
    return e.cache = c.set(u, f) || c, f;
  };
  return e.cache = new (Du.Cache || Xn)(), e;
}
Du.Cache = Xn;
var Cy = 500;
function Ay(n) {
  var r = Du(n, function(s) {
    return e.size === Cy && e.clear(), s;
  }), e = r.cache;
  return r;
}
var Ny = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, Oy = /\\(\\)?/g, Py = Ay(function(n) {
  var r = [];
  return n.charCodeAt(0) === 46 && r.push(""), n.replace(Ny, function(e, s, u, c) {
    r.push(u ? c.replace(Oy, "$1") : s || e);
  }), r;
});
function Ry(n) {
  return n == null ? "" : Ef(n);
}
function Cf(n, r) {
  return vt(n) ? n : Ru(n, r) ? [n] : Py(Ry(n));
}
function Ua(n) {
  if (typeof n == "string" || ui(n))
    return n;
  var r = n + "";
  return r == "0" && 1 / n == -1 / 0 ? "-0" : r;
}
function Fu(n, r) {
  r = Cf(r, n);
  for (var e = 0, s = r.length; n != null && e < s; )
    n = n[Ua(r[e++])];
  return e && e == s ? n : void 0;
}
function ci(n, r, e) {
  var s = n == null ? void 0 : Fu(n, r);
  return s === void 0 ? e : s;
}
function Af(n, r) {
  for (var e = -1, s = r.length, u = n.length; ++e < s; )
    n[u + e] = r[e];
  return n;
}
var pc = Zt ? Zt.isConcatSpreadable : void 0;
function Dy(n) {
  return vt(n) || cs(n) || !!(pc && n && n[pc]);
}
function Fy(n, r, e, s, u) {
  var c = -1, f = n.length;
  for (e || (e = Dy), u || (u = []); ++c < f; ) {
    var h = n[c];
    e(h) ? Af(u, h) : u[u.length] = h;
  }
  return u;
}
var Nf = Tf(Object.getPrototypeOf, Object), Gy = "[object Object]", By = Function.prototype, Uy = Object.prototype, Of = By.toString, zy = Uy.hasOwnProperty, qy = Of.call(Object);
function Yy(n) {
  if (!Ln(n) || Nr(n) != Gy)
    return !1;
  var r = Nf(n);
  if (r === null)
    return !0;
  var e = zy.call(r, "constructor") && r.constructor;
  return typeof e == "function" && e instanceof e && Of.call(e) == qy;
}
function Hy() {
  this.__data__ = new Vn(), this.size = 0;
}
function Jy(n) {
  var r = this.__data__, e = r.delete(n);
  return this.size = r.size, e;
}
function Vy(n) {
  return this.__data__.get(n);
}
function Xy(n) {
  return this.__data__.has(n);
}
var Wy = 200;
function Zy(n, r) {
  var e = this.__data__;
  if (e instanceof Vn) {
    var s = e.__data__;
    if (!gs || s.length < Wy - 1)
      return s.push([n, r]), this.size = ++e.size, this;
    e = this.__data__ = new Xn(s);
  }
  return e.set(n, r), this.size = e.size, this;
}
function ln(n) {
  var r = this.__data__ = new Vn(n);
  this.size = r.size;
}
ln.prototype.clear = Hy;
ln.prototype.delete = Jy;
ln.prototype.get = Vy;
ln.prototype.has = Xy;
ln.prototype.set = Zy;
var Pf = typeof exports == "object" && exports && !exports.nodeType && exports, mc = Pf && typeof module == "object" && module && !module.nodeType && module, jy = mc && mc.exports === Pf, vc = jy ? gn.Buffer : void 0, yc = vc ? vc.allocUnsafe : void 0;
function Rf(n, r) {
  if (r)
    return n.slice();
  var e = n.length, s = yc ? yc(e) : new n.constructor(e);
  return n.copy(s), s;
}
function $y(n, r) {
  for (var e = -1, s = n == null ? 0 : n.length, u = 0, c = []; ++e < s; ) {
    var f = n[e];
    r(f, e, n) && (c[u++] = f);
  }
  return c;
}
function Ky() {
  return [];
}
var Qy = Object.prototype, e0 = Qy.propertyIsEnumerable, _c = Object.getOwnPropertySymbols, t0 = _c ? function(n) {
  return n == null ? [] : (n = Object(n), $y(_c(n), function(r) {
    return e0.call(n, r);
  }));
} : Ky;
function n0(n, r, e) {
  var s = r(n);
  return vt(n) ? s : Af(s, e(n));
}
function Xo(n) {
  return n0(n, Fa, t0);
}
var Wo = Pr(gn, "DataView"), Zo = Pr(gn, "Promise"), ii = Pr(gn, "Set"), Ec = "[object Map]", r0 = "[object Object]", xc = "[object Promise]", wc = "[object Set]", kc = "[object WeakMap]", Sc = "[object DataView]", i0 = Or(Wo), s0 = Or(gs), a0 = Or(Zo), o0 = Or(ii), u0 = Or(Jo), an = Nr;
(Wo && an(new Wo(new ArrayBuffer(1))) != Sc || gs && an(new gs()) != Ec || Zo && an(Zo.resolve()) != xc || ii && an(new ii()) != wc || Jo && an(new Jo()) != kc) && (an = function(n) {
  var r = Nr(n), e = r == r0 ? n.constructor : void 0, s = e ? Or(e) : "";
  if (s)
    switch (s) {
      case i0:
        return Sc;
      case s0:
        return Ec;
      case a0:
        return xc;
      case o0:
        return wc;
      case u0:
        return kc;
    }
  return r;
});
var l0 = Object.prototype, c0 = l0.hasOwnProperty;
function h0(n) {
  var r = n.length, e = new n.constructor(r);
  return r && typeof n[0] == "string" && c0.call(n, "index") && (e.index = n.index, e.input = n.input), e;
}
var ha = gn.Uint8Array;
function Gu(n) {
  var r = new n.constructor(n.byteLength);
  return new ha(r).set(new ha(n)), r;
}
function f0(n, r) {
  var e = Gu(n.buffer);
  return new n.constructor(e, n.byteOffset, n.byteLength);
}
var g0 = /\w*$/;
function d0(n) {
  var r = new n.constructor(n.source, g0.exec(n));
  return r.lastIndex = n.lastIndex, r;
}
var Mc = Zt ? Zt.prototype : void 0, Ic = Mc ? Mc.valueOf : void 0;
function p0(n) {
  return Ic ? Object(Ic.call(n)) : {};
}
function Df(n, r) {
  var e = r ? Gu(n.buffer) : n.buffer;
  return new n.constructor(e, n.byteOffset, n.length);
}
var m0 = "[object Boolean]", v0 = "[object Date]", y0 = "[object Map]", _0 = "[object Number]", E0 = "[object RegExp]", x0 = "[object Set]", w0 = "[object String]", k0 = "[object Symbol]", S0 = "[object ArrayBuffer]", M0 = "[object DataView]", I0 = "[object Float32Array]", b0 = "[object Float64Array]", T0 = "[object Int8Array]", L0 = "[object Int16Array]", C0 = "[object Int32Array]", A0 = "[object Uint8Array]", N0 = "[object Uint8ClampedArray]", O0 = "[object Uint16Array]", P0 = "[object Uint32Array]";
function R0(n, r, e) {
  var s = n.constructor;
  switch (r) {
    case S0:
      return Gu(n);
    case m0:
    case v0:
      return new s(+n);
    case M0:
      return f0(n);
    case I0:
    case b0:
    case T0:
    case L0:
    case C0:
    case A0:
    case N0:
    case O0:
    case P0:
      return Df(n, e);
    case y0:
      return new s();
    case _0:
    case w0:
      return new s(n);
    case E0:
      return d0(n);
    case x0:
      return new s();
    case k0:
      return p0(n);
  }
}
function Ff(n) {
  return typeof n.constructor == "function" && !Ou(n) ? Hm(Nf(n)) : {};
}
var D0 = "[object Map]";
function F0(n) {
  return Ln(n) && an(n) == D0;
}
var bc = li && li.isMap, G0 = bc ? Da(bc) : F0, B0 = "[object Set]";
function U0(n) {
  return Ln(n) && an(n) == B0;
}
var Tc = li && li.isSet, z0 = Tc ? Da(Tc) : U0, q0 = 1, Gf = "[object Arguments]", Y0 = "[object Array]", H0 = "[object Boolean]", J0 = "[object Date]", V0 = "[object Error]", Bf = "[object Function]", X0 = "[object GeneratorFunction]", W0 = "[object Map]", Z0 = "[object Number]", Uf = "[object Object]", j0 = "[object RegExp]", $0 = "[object Set]", K0 = "[object String]", Q0 = "[object Symbol]", e1 = "[object WeakMap]", t1 = "[object ArrayBuffer]", n1 = "[object DataView]", r1 = "[object Float32Array]", i1 = "[object Float64Array]", s1 = "[object Int8Array]", a1 = "[object Int16Array]", o1 = "[object Int32Array]", u1 = "[object Uint8Array]", l1 = "[object Uint8ClampedArray]", c1 = "[object Uint16Array]", h1 = "[object Uint32Array]", Ue = {};
Ue[Gf] = Ue[Y0] = Ue[t1] = Ue[n1] = Ue[H0] = Ue[J0] = Ue[r1] = Ue[i1] = Ue[s1] = Ue[a1] = Ue[o1] = Ue[W0] = Ue[Z0] = Ue[Uf] = Ue[j0] = Ue[$0] = Ue[K0] = Ue[Q0] = Ue[u1] = Ue[l1] = Ue[c1] = Ue[h1] = !0;
Ue[V0] = Ue[Bf] = Ue[e1] = !1;
function $s(n, r, e, s, u, c) {
  var f, h = r & q0;
  if (f !== void 0)
    return f;
  if (!Rt(n))
    return n;
  var m = vt(n);
  if (m)
    f = h0(n);
  else {
    var d = an(n), y = d == Bf || d == X0;
    if (hs(n))
      return Rf(n, h);
    if (d == Uf || d == Gf || y && !u)
      f = y ? {} : Ff(n);
    else {
      if (!Ue[d])
        return u ? n : {};
      f = R0(n, d, h);
    }
  }
  c || (c = new ln());
  var _ = c.get(n);
  if (_)
    return _;
  c.set(n, f), z0(n) ? n.forEach(function(I) {
    f.add($s(I, r, e, I, n, c));
  }) : G0(n) && n.forEach(function(I, D) {
    f.set(D, $s(I, r, e, D, n, c));
  });
  var E = Xo, S = m ? void 0 : E(n);
  return tv(S || n, function(I, D) {
    S && (D = I, I = n[D]), wf(f, D, $s(I, r, e, D, n, c));
  }), f;
}
var f1 = 1, g1 = 4;
function hn(n) {
  return $s(n, f1 | g1);
}
var d1 = "__lodash_hash_undefined__";
function p1(n) {
  return this.__data__.set(n, d1), this;
}
function m1(n) {
  return this.__data__.has(n);
}
function hi(n) {
  var r = -1, e = n == null ? 0 : n.length;
  for (this.__data__ = new Xn(); ++r < e; )
    this.add(n[r]);
}
hi.prototype.add = hi.prototype.push = p1;
hi.prototype.has = m1;
function v1(n, r) {
  for (var e = -1, s = n == null ? 0 : n.length; ++e < s; )
    if (r(n[e], e, n))
      return !0;
  return !1;
}
function fa(n, r) {
  return n.has(r);
}
var y1 = 1, _1 = 2;
function zf(n, r, e, s, u, c) {
  var f = e & y1, h = n.length, m = r.length;
  if (h != m && !(f && m > h))
    return !1;
  var d = c.get(n), y = c.get(r);
  if (d && y)
    return d == r && y == n;
  var _ = -1, E = !0, S = e & _1 ? new hi() : void 0;
  for (c.set(n, r), c.set(r, n); ++_ < h; ) {
    var I = n[_], D = r[_];
    if (s)
      var q = f ? s(D, I, _, r, n, c) : s(I, D, _, n, r, c);
    if (q !== void 0) {
      if (q)
        continue;
      E = !1;
      break;
    }
    if (S) {
      if (!v1(r, function(G, M) {
        if (!fa(S, M) && (I === G || u(I, G, e, s, c)))
          return S.push(M);
      })) {
        E = !1;
        break;
      }
    } else if (!(I === D || u(I, D, e, s, c))) {
      E = !1;
      break;
    }
  }
  return c.delete(n), c.delete(r), E;
}
function E1(n) {
  var r = -1, e = Array(n.size);
  return n.forEach(function(s, u) {
    e[++r] = [u, s];
  }), e;
}
function Bu(n) {
  var r = -1, e = Array(n.size);
  return n.forEach(function(s) {
    e[++r] = s;
  }), e;
}
var x1 = 1, w1 = 2, k1 = "[object Boolean]", S1 = "[object Date]", M1 = "[object Error]", I1 = "[object Map]", b1 = "[object Number]", T1 = "[object RegExp]", L1 = "[object Set]", C1 = "[object String]", A1 = "[object Symbol]", N1 = "[object ArrayBuffer]", O1 = "[object DataView]", Lc = Zt ? Zt.prototype : void 0, yo = Lc ? Lc.valueOf : void 0;
function P1(n, r, e, s, u, c, f) {
  switch (e) {
    case O1:
      if (n.byteLength != r.byteLength || n.byteOffset != r.byteOffset)
        return !1;
      n = n.buffer, r = r.buffer;
    case N1:
      return !(n.byteLength != r.byteLength || !c(new ha(n), new ha(r)));
    case k1:
    case S1:
    case b1:
      return Es(+n, +r);
    case M1:
      return n.name == r.name && n.message == r.message;
    case T1:
    case C1:
      return n == r + "";
    case I1:
      var h = E1;
    case L1:
      var m = s & x1;
      if (h || (h = Bu), n.size != r.size && !m)
        return !1;
      var d = f.get(n);
      if (d)
        return d == r;
      s |= w1, f.set(n, r);
      var y = zf(h(n), h(r), s, u, c, f);
      return f.delete(n), y;
    case A1:
      if (yo)
        return yo.call(n) == yo.call(r);
  }
  return !1;
}
var R1 = 1, D1 = Object.prototype, F1 = D1.hasOwnProperty;
function G1(n, r, e, s, u, c) {
  var f = e & R1, h = Xo(n), m = h.length, d = Xo(r), y = d.length;
  if (m != y && !f)
    return !1;
  for (var _ = m; _--; ) {
    var E = h[_];
    if (!(f ? E in r : F1.call(r, E)))
      return !1;
  }
  var S = c.get(n), I = c.get(r);
  if (S && I)
    return S == r && I == n;
  var D = !0;
  c.set(n, r), c.set(r, n);
  for (var q = f; ++_ < m; ) {
    E = h[_];
    var G = n[E], M = r[E];
    if (s)
      var H = f ? s(M, G, E, r, n, c) : s(G, M, E, n, r, c);
    if (!(H === void 0 ? G === M || u(G, M, e, s, c) : H)) {
      D = !1;
      break;
    }
    q || (q = E == "constructor");
  }
  if (D && !q) {
    var V = n.constructor, X = r.constructor;
    V != X && "constructor" in n && "constructor" in r && !(typeof V == "function" && V instanceof V && typeof X == "function" && X instanceof X) && (D = !1);
  }
  return c.delete(n), c.delete(r), D;
}
var B1 = 1, Cc = "[object Arguments]", Ac = "[object Array]", Os = "[object Object]", U1 = Object.prototype, Nc = U1.hasOwnProperty;
function z1(n, r, e, s, u, c) {
  var f = vt(n), h = vt(r), m = f ? Ac : an(n), d = h ? Ac : an(r);
  m = m == Cc ? Os : m, d = d == Cc ? Os : d;
  var y = m == Os, _ = d == Os, E = m == d;
  if (E && hs(n)) {
    if (!hs(r))
      return !1;
    f = !0, y = !1;
  }
  if (E && !y)
    return c || (c = new ln()), f || Pu(n) ? zf(n, r, e, s, u, c) : P1(n, r, m, e, s, u, c);
  if (!(e & B1)) {
    var S = y && Nc.call(n, "__wrapped__"), I = _ && Nc.call(r, "__wrapped__");
    if (S || I) {
      var D = S ? n.value() : n, q = I ? r.value() : r;
      return c || (c = new ln()), u(D, q, e, s, c);
    }
  }
  return E ? (c || (c = new ln()), G1(n, r, e, s, u, c)) : !1;
}
function za(n, r, e, s, u) {
  return n === r ? !0 : n == null || r == null || !Ln(n) && !Ln(r) ? n !== n && r !== r : z1(n, r, e, s, za, u);
}
var q1 = 1, Y1 = 2;
function H1(n, r, e, s) {
  var u = e.length, c = u;
  if (n == null)
    return !c;
  for (n = Object(n); u--; ) {
    var f = e[u];
    if (f[2] ? f[1] !== n[f[0]] : !(f[0] in n))
      return !1;
  }
  for (; ++u < c; ) {
    f = e[u];
    var h = f[0], m = n[h], d = f[1];
    if (f[2]) {
      if (m === void 0 && !(h in n))
        return !1;
    } else {
      var y = new ln(), _;
      if (!(_ === void 0 ? za(d, m, q1 | Y1, s, y) : _))
        return !1;
    }
  }
  return !0;
}
function qf(n) {
  return n === n && !Rt(n);
}
function J1(n) {
  for (var r = Fa(n), e = r.length; e--; ) {
    var s = r[e], u = n[s];
    r[e] = [s, u, qf(u)];
  }
  return r;
}
function Yf(n, r) {
  return function(e) {
    return e == null ? !1 : e[n] === r && (r !== void 0 || n in Object(e));
  };
}
function V1(n) {
  var r = J1(n);
  return r.length == 1 && r[0][2] ? Yf(r[0][0], r[0][1]) : function(e) {
    return e === n || H1(e, n, r);
  };
}
function X1(n, r) {
  return n != null && r in Object(n);
}
function W1(n, r, e) {
  r = Cf(r, n);
  for (var s = -1, u = r.length, c = !1; ++s < u; ) {
    var f = Ua(r[s]);
    if (!(c = n != null && e(n, f)))
      break;
    n = n[f];
  }
  return c || ++s != u ? c : (u = n == null ? 0 : n.length, !!u && Nu(u) && Cu(f, u) && (vt(n) || cs(n)));
}
function Z1(n, r) {
  return n != null && W1(n, r, X1);
}
var j1 = 1, $1 = 2;
function K1(n, r) {
  return Ru(n) && qf(r) ? Yf(Ua(n), r) : function(e) {
    var s = ci(e, n);
    return s === void 0 && s === r ? Z1(e, n) : za(r, s, j1 | $1);
  };
}
function Q1(n) {
  return function(r) {
    return r == null ? void 0 : r[n];
  };
}
function e_(n) {
  return function(r) {
    return Fu(r, n);
  };
}
function t_(n) {
  return Ru(n) ? Q1(Ua(n)) : e_(n);
}
function Hf(n) {
  return typeof n == "function" ? n : n == null ? Pa : typeof n == "object" ? vt(n) ? K1(n[0], n[1]) : V1(n) : t_(n);
}
function n_(n, r, e, s) {
  for (var u = -1, c = n == null ? 0 : n.length; ++u < c; ) {
    var f = n[u];
    r(s, f, e(f), n);
  }
  return s;
}
function r_(n) {
  return function(r, e, s) {
    for (var u = -1, c = Object(r), f = s(r), h = f.length; h--; ) {
      var m = f[++u];
      if (e(c[m], m, c) === !1)
        break;
    }
    return r;
  };
}
var Jf = r_();
function i_(n, r) {
  return n && Jf(n, r, Fa);
}
function s_(n, r) {
  return function(e, s) {
    if (e == null)
      return e;
    if (!vi(e))
      return n(e, s);
    for (var u = e.length, c = -1, f = Object(e); ++c < u && s(f[c], c, f) !== !1; )
      ;
    return e;
  };
}
var Vf = s_(i_);
function a_(n, r, e, s) {
  return Vf(n, function(u, c, f) {
    r(s, u, e(u), f);
  }), s;
}
function o_(n, r) {
  return function(e, s) {
    var u = vt(e) ? n_ : a_, c = r ? r() : {};
    return u(e, n, Hf(s), c);
  };
}
var _o = function() {
  return gn.Date.now();
}, u_ = "Expected a function", l_ = Math.max, c_ = Math.min;
function Uu(n, r, e) {
  var s, u, c, f, h, m, d = 0, y = !1, _ = !1, E = !0;
  if (typeof n != "function")
    throw new TypeError(u_);
  r = oc(r) || 0, Rt(e) && (y = !!e.leading, _ = "maxWait" in e, c = _ ? l_(oc(e.maxWait) || 0, r) : c, E = "trailing" in e ? !!e.trailing : E);
  function S(j) {
    var $ = s, x = u;
    return s = u = void 0, d = j, f = n.apply(x, $), f;
  }
  function I(j) {
    return d = j, h = setTimeout(G, r), y ? S(j) : f;
  }
  function D(j) {
    var $ = j - m, x = j - d, k = r - $;
    return _ ? c_(k, c - x) : k;
  }
  function q(j) {
    var $ = j - m, x = j - d;
    return m === void 0 || $ >= r || $ < 0 || _ && x >= c;
  }
  function G() {
    var j = _o();
    if (q(j))
      return M(j);
    h = setTimeout(G, D(j));
  }
  function M(j) {
    return h = void 0, E && s ? S(j) : (s = u = void 0, f);
  }
  function H() {
    h !== void 0 && clearTimeout(h), d = 0, s = m = u = h = void 0;
  }
  function V() {
    return h === void 0 ? f : M(_o());
  }
  function X() {
    var j = _o(), $ = q(j);
    if (s = arguments, u = this, m = j, $) {
      if (h === void 0)
        return I(m);
      if (_)
        return clearTimeout(h), h = setTimeout(G, r), S(m);
    }
    return h === void 0 && (h = setTimeout(G, r)), f;
  }
  return X.cancel = H, X.flush = V, X;
}
function jo(n, r, e) {
  (e !== void 0 && !Es(n[r], e) || e === void 0 && !(r in n)) && Ra(n, r, e);
}
function Xf(n) {
  return Ln(n) && vi(n);
}
function $o(n, r) {
  if (!(r === "constructor" && typeof n[r] == "function") && r != "__proto__")
    return n[r];
}
function h_(n) {
  return cv(n, Lf(n));
}
function f_(n, r, e, s, u, c, f) {
  var h = $o(n, e), m = $o(r, e), d = f.get(m);
  if (d) {
    jo(n, e, d);
    return;
  }
  var y = c ? c(h, m, e + "", n, r, f) : void 0, _ = y === void 0;
  if (_) {
    var E = vt(m), S = !E && hs(m), I = !E && !S && Pu(m);
    y = m, E || S || I ? vt(h) ? y = h : Xf(h) ? y = Xm(h) : S ? (_ = !1, y = Rf(m, !0)) : I ? (_ = !1, y = Df(m, !0)) : y = [] : Yy(m) || cs(m) ? (y = h, cs(h) ? y = h_(h) : (!Rt(h) || Lu(h)) && (y = Ff(m))) : _ = !1;
  }
  _ && (f.set(m, y), u(y, m, s, c, f), f.delete(m)), jo(n, e, y);
}
function zu(n, r, e, s, u) {
  n !== r && Jf(r, function(c, f) {
    if (u || (u = new ln()), Rt(c))
      f_(n, r, f, e, zu, s, u);
    else {
      var h = s ? s($o(n, f), c, f + "", n, r, u) : void 0;
      h === void 0 && (h = c), jo(n, f, h);
    }
  }, Lf);
}
var g_ = kf(function(n, r, e, s) {
  zu(n, r, e, s);
});
function d_(n, r, e) {
  for (var s = -1, u = n == null ? 0 : n.length; ++s < u; )
    if (e(r, n[s]))
      return !0;
  return !1;
}
function p_(n, r) {
  var e = -1, s = vi(n) ? Array(n.length) : [];
  return Vf(n, function(u, c, f) {
    s[++e] = r(u, c, f);
  }), s;
}
function m_(n, r) {
  return ri(r, function(e) {
    return n[e];
  });
}
function v_(n) {
  return n == null ? [] : m_(n, Fa(n));
}
var y_ = Math.min;
function __(n, r, e) {
  for (var s = xf, u = n[0].length, c = n.length, f = c, h = Array(c), m = 1 / 0, d = []; f--; ) {
    var y = n[f];
    m = y_(y.length, m), h[f] = u >= 120 && y.length >= 120 ? new hi(f && y) : void 0;
  }
  y = n[0];
  var _ = -1, E = h[0];
  e:
    for (; ++_ < u && d.length < m; ) {
      var S = y[_], I = S;
      if (S = S !== 0 ? S : 0, !(E ? fa(E, I) : s(d, I))) {
        for (f = c; --f; ) {
          var D = h[f];
          if (!(D ? fa(D, I) : s(n[f], I)))
            continue e;
        }
        E && E.push(I), d.push(S);
      }
    }
  return d;
}
function E_(n) {
  return Xf(n) ? n : [];
}
var x_ = Au(function(n) {
  var r = ri(n, E_);
  return r.length && r[0] === n[0] ? __(r) : [];
});
function qa(n, r) {
  return za(n, r);
}
var w_ = o_(function(n, r, e) {
  Ra(n, e, r);
}), k_ = kf(function(n, r, e) {
  zu(n, r, e);
});
function S_(n, r) {
  var e = n.length;
  for (n.sort(r); e--; )
    n[e] = n[e].value;
  return n;
}
function M_(n, r) {
  if (n !== r) {
    var e = n !== void 0, s = n === null, u = n === n, c = ui(n), f = r !== void 0, h = r === null, m = r === r, d = ui(r);
    if (!h && !d && !c && n > r || c && f && m && !h && !d || s && f && m || !e && m || !u)
      return 1;
    if (!s && !c && !d && n < r || d && e && u && !s && !c || h && e && u || !f && u || !m)
      return -1;
  }
  return 0;
}
function I_(n, r, e) {
  for (var s = -1, u = n.criteria, c = r.criteria, f = u.length, h = e.length; ++s < f; ) {
    var m = M_(u[s], c[s]);
    if (m) {
      if (s >= h)
        return m;
      var d = e[s];
      return m * (d == "desc" ? -1 : 1);
    }
  }
  return n.index - r.index;
}
function b_(n, r, e) {
  r.length ? r = ri(r, function(c) {
    return vt(c) ? function(f) {
      return Fu(f, c.length === 1 ? c[0] : c);
    } : c;
  }) : r = [Pa];
  var s = -1;
  r = ri(r, Da(Hf));
  var u = p_(n, function(c, f, h) {
    var m = ri(r, function(d) {
      return d(c);
    });
    return { criteria: m, index: ++s, value: c };
  });
  return S_(u, function(c, f) {
    return I_(c, f, e);
  });
}
var Oc = Au(function(n, r) {
  if (n == null)
    return [];
  var e = r.length;
  return e > 1 && Vo(n, r[0], r[1]) ? r = [] : e > 2 && Vo(r[0], r[1], r[2]) && (r = [r[0]]), b_(n, Fy(r), []);
}), T_ = "Expected a function";
function Wf(n, r, e) {
  var s = !0, u = !0;
  if (typeof n != "function")
    throw new TypeError(T_);
  return Rt(e) && (s = "leading" in e ? !!e.leading : s, u = "trailing" in e ? !!e.trailing : u), Uu(n, r, {
    leading: s,
    maxWait: r,
    trailing: u
  });
}
var L_ = 1 / 0, C_ = ii && 1 / Bu(new ii([, -0]))[1] == L_ ? function(n) {
  return new ii(n);
} : Vm, A_ = 200;
function N_(n, r, e) {
  var s = -1, u = xf, c = n.length, f = !0, h = [], m = h;
  if (e)
    f = !1, u = d_;
  else if (c >= A_) {
    var d = C_(n);
    if (d)
      return Bu(d);
    f = !1, u = fa, m = new hi();
  } else
    m = h;
  e:
    for (; ++s < c; ) {
      var y = n[s], _ = y;
      if (y = e || y !== 0 ? y : 0, f && _ === _) {
        for (var E = m.length; E--; )
          if (m[E] === _)
            continue e;
        h.push(y);
      } else u(m, _, e) || (m !== h && m.push(_), h.push(y));
    }
  return h;
}
function Pc(n, r) {
  return r = typeof r == "function" ? r : void 0, n && n.length ? N_(n, void 0, r) : [];
}
const Rc = (n, r) => n[0] === r[0] && n[1] === r[1], ss = (n) => n.type === "Feature" && n.geometry.type === "LineString", Dc = (n) => n.type === "Feature" && n.geometry.type === "MultiLineString", qu = (n) => n.type === "Feature" && n.geometry.type === "Polygon", Yu = (n) => n.type === "Feature" && n.geometry.type === "MultiPolygon", Fc = (n) => ({
  type: "FeatureCollection",
  features: n.geometry.coordinates.map((r) => ({
    type: "Feature",
    properties: n.properties,
    geometry: {
      type: "LineString",
      coordinates: r
    }
  }))
}), Gc = (n, r) => ({
  lng: r[0] - n[0],
  lat: r[1] - n[1]
}), ga = (n) => Array.isArray(n) && n.length >= 2 && n.length <= 3 && n.every((r) => typeof r == "number"), xs = (n, r, e = !1) => {
  let s = 0;
  const u = ["features", "geometries", "geometry", "coordinates"], c = (f, h, m = !1) => {
    ga(f) ? (r({ coordinate: f, path: h }, s), s += 1) : Array.isArray(f) ? f.forEach((d, y) => {
      m && e && y === f.length - 1 && ga(d) || c(d, [...h, y], m);
    }) : typeof f == "object" && f !== null && ft(f).forEach((d) => {
      const y = f[d];
      if (u.includes(d) && y) {
        const _ = "type" in f && f.type, E = _ === "Polygon" || _ === "MultiPolygon";
        c(y, [...h, d], E);
      }
    });
  };
  c(n, []);
}, O_ = (n, r) => {
  let e = { coordinate: [0, 0], path: [] }, s = -1;
  try {
    xs(n, (u, c) => {
      if (r[0] === u.coordinate[0] && r[1] === u.coordinate[1])
        throw s = c, e = u, new Error("stop");
    });
  } catch {
    if (e)
      return {
        index: s,
        coordinate: e.coordinate,
        path: e.path
      };
  }
  return null;
}, Hu = (n, r) => {
  let e = 0;
  const s = ["features", "geometries", "geometry", "coordinates"], u = (c, f, h, m) => {
    ga(c) && ga(f) ? (r(
      {
        start: { coordinate: [...c], path: h },
        end: { coordinate: [...f], path: m }
      },
      e
    ), e += 1) : Array.isArray(c) ? c.forEach((d, y) => {
      u(
        d,
        c[y + 1],
        [...h, y],
        [...h, y + 1]
      );
    }) : typeof c == "object" && c !== null && ft(c).forEach((d) => {
      const y = c[d];
      s.includes(d) && y && u(y, void 0, [...h, d], []);
    });
  };
  u(n, void 0, [], []);
}, Ya = (n, r) => {
  let e = {
    absCoordIndex: -1,
    featureIndex: -1,
    multiFeatureIndex: -1,
    geometryIndex: -1
  };
  try {
    fr(
      n,
      (s, u, c, f, h) => {
        if (s[0] === r[0] && s[1] === r[1])
          throw e = { absCoordIndex: u, featureIndex: c, multiFeatureIndex: f, geometryIndex: h }, new Error("found");
      }
    );
  } catch {
  }
  return e;
}, zS = (n, r, e = {}) => ({
  type: "Feature",
  properties: e,
  geometry: {
    type: "LineString",
    coordinates: [n, r]
  }
}), ei = (n, r) => {
  const [e, s] = n, [u, c] = r, f = Math.min(e, u), h = Math.min(s, c), m = Math.max(e, u), d = Math.max(s, c);
  return [f, h, m, d];
}, Ko = (n, r) => {
  const e = ei(n, r), s = [e[0], e[1]], u = [e[2], e[3]], c = s[0], f = s[1], h = u[0], m = u[1];
  return {
    type: "Feature",
    properties: {
      shape: "rectangle"
    },
    geometry: {
      type: "Polygon",
      coordinates: [[
        [c, f],
        [h, f],
        [h, m],
        [c, m],
        [c, f]
      ]]
    }
  };
}, Zf = (n) => [
  n.geometry.coordinates[0],
  n.geometry.coordinates[1]
], Ju = (n) => {
  const r = gf(n);
  return [
    [r[0], r[1]],
    // South-West (min-x, min-y)
    [r[2], r[3]]
    // North-East (max-x, max-y)
  ];
}, P_ = (n) => [
  n[0][0],
  n[0][1],
  n[1][0],
  n[1][1]
], R_ = (n, r) => {
  const [e, s, u, c] = n, [f, h] = r;
  return f >= e && f <= u && h >= s && h <= c;
}, qS = (n, r) => {
  const e = P_(n);
  return R_(e, r);
}, Eo = (n) => {
  let r = 0;
  return fr(n, () => {
    r += 1;
  }, !0), r;
}, D_ = (n) => {
  const r = [];
  return fr(n, (e) => {
    r.push([e[0], e[1]]);
  }, !0), r;
}, jf = (n) => {
  const r = D_(n);
  return r.some((e) => !qa(r[0], e));
}, $f = (n) => {
  let r = null;
  try {
    xs(n, (e) => {
      throw r = e.coordinate, new Error("found");
    });
  } catch {
    return r;
  }
  return null;
}, Ks = (n, r) => Math.sqrt(
  (n[0] - r[0]) ** 2 + (n[1] - r[1]) ** 2
), F_ = (n, r, e) => {
  const [s, u] = [n[0], n[1]], [c, f] = [r[0], r[1]], [h, m] = [e[0], e[1]], d = c - s, y = f - u, _ = h - s, E = m - u, S = _ * d + E * y, I = d * d + y * y;
  let D = S / I;
  return D = Math.max(0, Math.min(1, D)), [
    s + D * d,
    u + D * y
  ];
}, G_ = (n, r) => {
  const { absCoordIndex: e } = Ya(n, r);
  return e !== -1 ? (n.geometry.coordinates.splice(e, 1), !0) : !1;
}, B_ = (n, r) => {
  const e = Ya(n, r);
  if (e.absCoordIndex !== -1) {
    const s = [e.geometryIndex], u = ci(n.geometry.coordinates, s), c = u.findIndex((f) => qa(f, r));
    return u.length <= 4 ? (n.geometry.coordinates.splice(e.geometryIndex, 1), !0) : (u.splice(c, 1), c === 0 && (u[u.length - 1] = [...u[0]]), !0);
  }
  return !1;
}, U_ = (n, r) => {
  const e = Ya(n, r);
  if (e.absCoordIndex !== -1) {
    const s = [
      e.multiFeatureIndex,
      e.geometryIndex
    ], u = ci(n.geometry.coordinates, s), c = u.findIndex((f) => qa(f, r));
    if (u.length <= 4) {
      s.pop();
      const f = ci(
        n.geometry.coordinates,
        e.multiFeatureIndex
      );
      return f.splice(e.geometryIndex, 1), f.length === 0 && n.geometry.coordinates.splice(e.multiFeatureIndex, 1), !0;
    }
    return u.splice(c, 1), c === 0 && (u[u.length - 1] = [...u[0]]), !0;
  }
  return !1;
}, z_ = (n, r) => ss(n) ? G_(n, r) : qu(n) ? B_(n, r) : Yu(n) ? U_(n, r) : !1, YS = (n) => {
  let r = 0;
  return Hu(n, (e) => {
    r += on(
      e.start.coordinate,
      e.end.coordinate,
      { units: "meters" }
    );
  }), r;
}, HS = (n) => {
  const r = {
    type: "FeatureCollection",
    features: []
  };
  return n.features.forEach((e) => {
    if (ss(e))
      r.features.push(e);
    else if (qu(e)) {
      const s = pf(e);
      ss(s) ? r.features.push(s) : Dc(s) && Fc(s).features.forEach((c) => {
        r.features.push(c);
      });
    } else Yu(e) ? mf(e).features.forEach((u) => {
      ss(u) ? r.features.push(u) : Dc(u) && Fc(u).features.forEach((f) => {
        r.features.push(f);
      });
    }) : ae.warn(
      "AutoTraceHelper.getFeaturesGeoJsonAsLines: Feature is not supported",
      e
    );
  }), r;
}, q_ = (n, r = "marker") => ({
  type: "Feature",
  properties: {
    shape: r
  },
  geometry: {
    type: "Point",
    coordinates: n
  }
}), Vu = ({ center: n, radius: r, steps: e = 80 }) => {
  const s = lm(
    n,
    r,
    {
      steps: e,
      units: "meters"
    }
  );
  return s.geometry.coordinates[0][0] = [
    ...s.geometry.coordinates[0][0]
  ], s;
};
function Kf(n, r = {}) {
  let e = 0, s = 0, u = 0;
  return fr(
    n,
    function(c) {
      e += c[0], s += c[1], u++;
    },
    !0
  ), Un([e / u, s / u], r.properties);
}
var Qf = Kf;
const Y_ = ["circle", "rectangle"];
class da {
  constructor(r) {
    R(this, "gm");
    R(this, "id", "no-id");
    R(this, "parent", null);
    R(this, "shape");
    R(this, "markers");
    R(this, "shapeProperties", { center: null });
    R(this, "source");
    R(this, "orders", this.getEmptyOrders());
    this.gm = r.gm, this.id = r.id, this.source = r.source, this.parent = r.parent, this.markers = /* @__PURE__ */ new Map(), this.shape = r.geoJsonShapeFeature.properties.shape, this.order = this.getFreeOrder(), this.addGeoJson(r.geoJsonShapeFeature);
  }
  get order() {
    const r = this.source.id;
    if (this.orders[r] !== null)
      return this.orders[r];
    throw new Error(`Null order for feature id: ${this.id}`);
  }
  set order(r) {
    const e = this.source.id;
    this.orders[e] = r;
  }
  getEmptyOrders() {
    return Object.fromEntries(
      ji(ee).map((r) => [r, null])
    );
  }
  get temporary() {
    return this.source.id === ee.temporary;
  }
  get sourceName() {
    return this.source.id;
  }
  getFreeOrder() {
    return this.getSourceGeoJson().features.length;
  }
  getGeoJson() {
    if (!this.isFeatureAvailable())
      throw new Error(`Feature not found: "${this.id}"`);
    this.fixOrder();
    const r = this.getSourceGeoJson().features[this.order] || null;
    if (this.id !== (r == null ? void 0 : r.id))
      throw ae.error(`Feature not found: ${this.id} !== ${r == null ? void 0 : r.id}`, r, this.getSourceGeoJson()), new Error("Feature not found");
    return r;
  }
  getShapeProperty(r) {
    return this.shapeProperties[r];
  }
  setShapeProperty(r, e) {
    this.shapeProperties[r] = e;
  }
  getSourceGeoJson() {
    return this.source.getGeoJson();
  }
  addGeoJson(r) {
    if (!this.isFeatureAvailable())
      throw new Error(`Feature not found: "${this.id}"`);
    const e = this.getSourceGeoJson();
    e.features[this.order] && ae.error("FeatureData.addGeoJson, not an empty feature", this.id, e);
    const s = {
      ...r,
      id: this.id,
      properties: {
        ...r.properties,
        [br]: this.id
      }
    };
    e.features[this.order] = s, this.updateGeoJsonCenter(s), this.gm.features.updateSourceData({
      diff: { add: [s] },
      sourceName: this.sourceName
    });
  }
  removeGeoJson() {
    if (!this.isFeatureAvailable())
      throw new Error(`Feature not found: "${this.id}"`);
    this.fixOrder();
    const r = this.getSourceGeoJson();
    delete r.features[this.order], this.gm.features.updateSourceData({
      diff: { remove: [this.id] },
      sourceName: this.sourceName
    }), this.order = null;
  }
  removeMarkers() {
    this.markers.forEach((r) => {
      r.instance instanceof Su ? r.instance.remove() : this.gm.features.delete(r.instance);
    }), this.markers = /* @__PURE__ */ new Map();
  }
  updateGeoJsonGeometry(r) {
    if (!this.isFeatureAvailable())
      throw new Error(`Feature not found: "${this.id}"`);
    this.fixOrder();
    const e = this.getSourceGeoJson();
    e.features[this.order].geometry = r;
    const s = {
      update: [
        e.features[this.order]
      ]
    };
    this.gm.features.updateSourceData({
      diff: s,
      sourceName: this.sourceName
    });
  }
  updateGeoJsonProperties(r) {
    if (!this.isFeatureAvailable())
      throw new Error(`Feature not found: "${this.id}"`);
    this.fixOrder();
    const e = this.getSourceGeoJson();
    e.features[this.order].properties = {
      ...e.features[this.order].properties,
      ...r
    };
    const s = {
      update: [
        e.features[this.order]
      ]
    };
    this.gm.features.updateSourceData({
      diff: s,
      sourceName: this.sourceName
    });
  }
  updateGeoJsonCenter(r) {
    if (this.shape === "circle") {
      const e = Zf(Qf(r));
      this.setShapeProperty("center", e);
    }
  }
  convertToPolygon() {
    return this.isConvertableToPolygon() ? (this.shape = "polygon", this.shapeProperties.center = null, !0) : !1;
  }
  isConvertableToPolygon() {
    return Y_.includes(this.shape);
  }
  fixOrder() {
    if (!this.isFeatureAvailable())
      throw new Error(`Feature not found: "${this.id}"`);
  }
  isFeatureAvailable() {
    return this.order !== null;
  }
  changeSource({ sourceName: r, atomic: e }) {
    e ? this.gm.features.withAtomicSourcesUpdate(
      () => this.actualChangeSource({ sourceName: r, atomic: e })
    ) : this.actualChangeSource({ sourceName: r, atomic: e });
  }
  actualChangeSource({ sourceName: r, atomic: e }) {
    if (this.source.id === r) {
      ae.error(`FeatureData.changeSource: feature "${this.id}" already has the source "${r}"`);
      return;
    }
    const s = this.gm.features.sources[r];
    if (!s) {
      ae.error(`FeatureData.changeSource: missing source "${r}"`);
      return;
    }
    const u = this.getGeoJson();
    this.removeGeoJson(), this.source = s, this.order = this.getFreeOrder(), this.addGeoJson(u), this.markers.forEach((c) => {
      c.instance instanceof da && c.instance.changeSource({ sourceName: r, atomic: e });
    });
  }
  delete() {
    this.removeGeoJson(), this.removeMarkers(), this.id = "no-id", this.orders = this.getEmptyOrders();
  }
}
const JS = (n) => jt(n) && n.action === "before_create", VS = (n) => jt(n) && n.action === "before_update", H_ = ["on", "off"], eg = (n) => jt(n) && n.type === "control" && H_.includes(n.action), jt = (n) => !!(n && typeof n == "object" && "level" in n && "type" in n && "action" in n), Xu = (n) => jt(n) && Ir(n.action, em), pe = "gm";
class Ha {
  constructor(r) {
    R(this, "gm");
    this.gm = r;
  }
  trackExclusiveModes(r) {
    if (r.action !== "mode_start")
      return;
    const {
      sectionName: e,
      modeName: s
    } = this.getControlIds(r) || {}, u = this.getControl(r);
    u != null && u.settings.exclusive && this.gm.control.eachControlWithOptions((c) => {
      const f = c.control.type, h = c.control.targetMode;
      f === e && h === s || c.controlOptions.active && c.control.settings.exclusive && this.gm.options.disableMode(f, h);
    });
  }
  trackRelatedModes(r) {
    Xu(r) && this.gm.control.eachControlWithOptions((e) => {
      var u;
      const s = e.control;
      (u = s.settings.enabledBy) != null && u.includes(r.mode) && (r.action === "mode_start" ? this.gm.options.enableMode(s.type, s.targetMode) : r.action === "mode_end" ? this.gm.options.disableMode(s.type, s.targetMode) : ae.error("Unknown mode action", r.action));
    });
  }
  getControl(r) {
    const { modeName: e, sectionName: s } = this.getControlIds(r) || {};
    return e && s ? this.gm.control.getControl({ actionType: s, modeName: e }) : null;
  }
  getControlOptions(r) {
    const { modeName: e, sectionName: s } = this.getControlIds(r) || {};
    return e && s ? this.gm.options.getControlOptions({ actionType: s, modeName: e }) : null;
  }
  getControlIds(r) {
    let e = null, s = null;
    return r.action === "mode_start" ? (e = r.type, s = r.mode) : eg(r) && (e = r.section, s = r.target), e && s ? { sectionName: e, modeName: s } : null;
  }
}
class J_ {
  isInstanceAvailable() {
    return this.sourceInstance ? !0 : (ae.error("Source instance is not available"), !1);
  }
}
const V_ = [
  "intersection_violation",
  "containment_violation"
], Ja = (n) => jt(n) && n.type === "helper", X_ = (n) => Ja(n) && n.mode === "geofencing" && Ir(n.action, V_), W_ = ["draw", "edit", "helper"];
class Wu {
  constructor(r) {
    R(this, "gm");
    R(this, "options", []);
    R(this, "actions", []);
    R(this, "flags", {
      featureCreateAllowed: !0,
      featureUpdateAllowed: !0
    });
    R(this, "internalMapEventHandlers", {
      [`${pe}:helper`]: this.handleHelperEvent.bind(this)
    });
    this.gm = r;
  }
  startAction() {
    this.gm.events.bus.attachEvents(this.internalMapEventHandlers), this.gm.events.bus.attachEvents(this.mapEventHandlers), this.onStartAction();
  }
  endAction() {
    this.onEndAction(), this.gm.events.bus.detachEvents(this.mapEventHandlers), this.gm.events.bus.detachEvents(this.internalMapEventHandlers);
  }
  get snappingHelper() {
    return this.gm.actionInstances.helper__snapping || null;
  }
  getOptionValue(r) {
    const e = this.options.find((s) => s.name === r);
    if (!e)
      throw new Error(`Option ${r} not found`);
    if (e.type === "toggle")
      return e.value;
    if (e.type === "select")
      return e.value.value;
    throw new Error(`Unknown option type: ${JSON.stringify(e)}`);
  }
  applyOptionValue(r, e) {
    const s = this.options.find((u) => u.name === r);
    if (!s) {
      ae.error("Option not found", r, e);
      return;
    }
    if (s.type === "toggle" && typeof e == "boolean")
      s.value = e;
    else if (s.type === "select") {
      const u = s.choices.find((c) => c.value === e);
      u && (s.value = u);
    } else
      ae.error("Can't apply option value", r, e, s);
  }
  handleHelperEvent(r) {
    return X_(r) ? this.handleGeofencingViolationEvent(r) : { next: !0 };
  }
  handleGeofencingViolationEvent(r) {
    return r.actionType === "draw" ? this.flags.featureCreateAllowed = !1 : r.actionType === "edit" && (this.flags.featureUpdateAllowed = !1), { next: !0 };
  }
  fireBeforeFeatureCreate({ geoJsonFeatures: r, forceMode: e = void 0 }) {
    this.flags.featureCreateAllowed = !0;
    const s = {
      level: "system",
      type: this.actionType,
      mode: e || this.mode,
      action: "before_create",
      geoJsonFeatures: r
    };
    this.gm.events.fire(`${pe}:${this.actionType}`, s);
  }
  fireBeforeFeatureUpdate({ features: r, geoJsonFeatures: e, forceMode: s = void 0 }) {
    this.flags.featureUpdateAllowed = !0;
    const u = {
      level: "system",
      type: this.actionType,
      mode: s || this.mode,
      action: "before_update",
      features: r,
      geoJsonFeatures: e
    };
    this.gm.events.fire(`${pe}:${this.actionType}`, u);
  }
}
const Zu = (n) => jt(n) && n.type === "draw", XS = (n) => jt(n) && n.type === "draw" && "variant" in n && n.variant === null, tg = (n) => jt(n) && n.type === "draw" && "variant" in n && n.variant === "line_drawer", WS = (n) => jt(n) && n.type === "draw" && "variant" in n && n.variant === "freehand_drawer", as = [
  // shapes
  "marker",
  "circle",
  "circle_marker",
  "text_marker",
  "line",
  "rectangle",
  "polygon"
], Z_ = [
  "freehand",
  "custom_shape"
], ng = [
  ...as,
  ...Z_
];
class Wn extends Wu {
  constructor() {
    super(...arguments);
    R(this, "actionType", "draw");
    R(this, "shape", null);
    R(this, "featureData", null);
  }
  saveFeature() {
    if (this.featureData) {
      const e = this.featureData.getGeoJson();
      this.removeTmpFeature(), this.gm.features.createFeature({
        sourceName: ee.main,
        shapeGeoJson: e
      });
    } else
      ae.error("BaseDraw.saveFeature: no featureData to save");
  }
  removeTmpFeature() {
    this.featureData && (this.featureData.temporary || ae.error("Not a temporary feature to remove", this.featureData), this.gm.features.delete(this.featureData), this.featureData = null);
  }
  fireMarkerPointerStartEvent() {
    if (!this.gm.markerPointer.marker || !this.shape)
      return;
    const e = this.gm.markerPointer.marker, s = {
      level: "system",
      variant: null,
      type: "draw",
      mode: this.shape,
      action: "start",
      markerData: {
        type: "dom",
        instance: e,
        position: {
          coordinate: e.getLngLat(),
          path: [-1]
        }
      },
      featureData: this.featureData
    };
    this.gm.events.fire(`${pe}:draw`, s);
  }
  fireMarkerPointerUpdateEvent() {
    if (!this.gm.markerPointer.marker || !this.shape)
      return;
    const e = this.gm.markerPointer.marker, s = {
      level: "system",
      variant: null,
      type: "draw",
      mode: this.shape,
      action: "update",
      markerData: {
        type: "dom",
        instance: e,
        position: {
          coordinate: e.getLngLat(),
          path: [-1]
        }
      },
      featureData: this.featureData
    };
    this.gm.events.fire(`${pe}:draw`, s);
  }
  fireMarkerPointerFinishEvent() {
    if (!this.shape)
      return;
    const e = {
      level: "system",
      variant: null,
      type: "draw",
      mode: this.shape,
      action: "finish"
    };
    this.gm.events.fire(`${pe}:draw`, e);
  }
  forwardLineDrawerEvent(e) {
    if (!tg(e) || !this.shape)
      return { next: !0 };
    if (e.action === "start" || e.action === "update") {
      const s = {
        level: "system",
        type: "draw",
        mode: this.shape,
        variant: null,
        action: e.action,
        featureData: e.featureData,
        markerData: e.markerData
      };
      this.gm.events.fire(`${pe}:draw`, s);
    } else if (e.action === "finish" || e.action === "cancel") {
      const s = {
        level: "system",
        type: "draw",
        mode: this.shape,
        variant: null,
        action: e.action
      };
      this.gm.events.fire(`${pe}:draw`, s);
    }
    return { next: !0 };
  }
}
const qn = 11102230246251565e-32, ht = 134217729, j_ = (3 + 8 * qn) * qn;
function xo(n, r, e, s, u) {
  let c, f, h, m, d = r[0], y = s[0], _ = 0, E = 0;
  y > d == y > -d ? (c = d, d = r[++_]) : (c = y, y = s[++E]);
  let S = 0;
  if (_ < n && E < e)
    for (y > d == y > -d ? (f = d + c, h = c - (f - d), d = r[++_]) : (f = y + c, h = c - (f - y), y = s[++E]), c = f, h !== 0 && (u[S++] = h); _ < n && E < e; )
      y > d == y > -d ? (f = c + d, m = f - c, h = c - (f - m) + (d - m), d = r[++_]) : (f = c + y, m = f - c, h = c - (f - m) + (y - m), y = s[++E]), c = f, h !== 0 && (u[S++] = h);
  for (; _ < n; )
    f = c + d, m = f - c, h = c - (f - m) + (d - m), d = r[++_], c = f, h !== 0 && (u[S++] = h);
  for (; E < e; )
    f = c + y, m = f - c, h = c - (f - m) + (y - m), y = s[++E], c = f, h !== 0 && (u[S++] = h);
  return (c !== 0 || S === 0) && (u[S++] = c), S;
}
function $_(n, r) {
  let e = r[0];
  for (let s = 1; s < n; s++) e += r[s];
  return e;
}
function ws(n) {
  return new Float64Array(n);
}
const K_ = (3 + 16 * qn) * qn, Q_ = (2 + 12 * qn) * qn, eE = (9 + 64 * qn) * qn * qn, Zr = ws(4), Bc = ws(8), Uc = ws(12), zc = ws(16), dt = ws(4);
function tE(n, r, e, s, u, c, f) {
  let h, m, d, y, _, E, S, I, D, q, G, M, H, V, X, j, $, x;
  const k = n - u, T = e - u, L = r - c, A = s - c;
  V = k * A, E = ht * k, S = E - (E - k), I = k - S, E = ht * A, D = E - (E - A), q = A - D, X = I * q - (V - S * D - I * D - S * q), j = L * T, E = ht * L, S = E - (E - L), I = L - S, E = ht * T, D = E - (E - T), q = T - D, $ = I * q - (j - S * D - I * D - S * q), G = X - $, _ = X - G, Zr[0] = X - (G + _) + (_ - $), M = V + G, _ = M - V, H = V - (M - _) + (G - _), G = H - j, _ = H - G, Zr[1] = H - (G + _) + (_ - j), x = M + G, _ = x - M, Zr[2] = M - (x - _) + (G - _), Zr[3] = x;
  let F = $_(4, Zr), O = Q_ * f;
  if (F >= O || -F >= O || (_ = n - k, h = n - (k + _) + (_ - u), _ = e - T, d = e - (T + _) + (_ - u), _ = r - L, m = r - (L + _) + (_ - c), _ = s - A, y = s - (A + _) + (_ - c), h === 0 && m === 0 && d === 0 && y === 0) || (O = eE * f + j_ * Math.abs(F), F += k * y + A * h - (L * d + T * m), F >= O || -F >= O)) return F;
  V = h * A, E = ht * h, S = E - (E - h), I = h - S, E = ht * A, D = E - (E - A), q = A - D, X = I * q - (V - S * D - I * D - S * q), j = m * T, E = ht * m, S = E - (E - m), I = m - S, E = ht * T, D = E - (E - T), q = T - D, $ = I * q - (j - S * D - I * D - S * q), G = X - $, _ = X - G, dt[0] = X - (G + _) + (_ - $), M = V + G, _ = M - V, H = V - (M - _) + (G - _), G = H - j, _ = H - G, dt[1] = H - (G + _) + (_ - j), x = M + G, _ = x - M, dt[2] = M - (x - _) + (G - _), dt[3] = x;
  const N = xo(4, Zr, 4, dt, Bc);
  V = k * y, E = ht * k, S = E - (E - k), I = k - S, E = ht * y, D = E - (E - y), q = y - D, X = I * q - (V - S * D - I * D - S * q), j = L * d, E = ht * L, S = E - (E - L), I = L - S, E = ht * d, D = E - (E - d), q = d - D, $ = I * q - (j - S * D - I * D - S * q), G = X - $, _ = X - G, dt[0] = X - (G + _) + (_ - $), M = V + G, _ = M - V, H = V - (M - _) + (G - _), G = H - j, _ = H - G, dt[1] = H - (G + _) + (_ - j), x = M + G, _ = x - M, dt[2] = M - (x - _) + (G - _), dt[3] = x;
  const P = xo(N, Bc, 4, dt, Uc);
  V = h * y, E = ht * h, S = E - (E - h), I = h - S, E = ht * y, D = E - (E - y), q = y - D, X = I * q - (V - S * D - I * D - S * q), j = m * d, E = ht * m, S = E - (E - m), I = m - S, E = ht * d, D = E - (E - d), q = d - D, $ = I * q - (j - S * D - I * D - S * q), G = X - $, _ = X - G, dt[0] = X - (G + _) + (_ - $), M = V + G, _ = M - V, H = V - (M - _) + (G - _), G = H - j, _ = H - G, dt[1] = H - (G + _) + (_ - j), x = M + G, _ = x - M, dt[2] = M - (x - _) + (G - _), dt[3] = x;
  const Y = xo(P, Uc, 4, dt, zc);
  return zc[Y - 1];
}
function nE(n, r, e, s, u, c) {
  const f = (r - c) * (e - u), h = (n - u) * (s - c), m = f - h, d = Math.abs(f + h);
  return Math.abs(m) >= K_ * d ? m : -tE(n, r, e, s, u, c, d);
}
function rE(n, r) {
  var e, s, u = 0, c, f, h, m, d, y, _, E = n[0], S = n[1], I = r.length;
  for (e = 0; e < I; e++) {
    s = 0;
    var D = r[e], q = D.length - 1;
    if (y = D[0], y[0] !== D[q][0] && y[1] !== D[q][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (f = y[0] - E, h = y[1] - S, s; s < q; s++) {
      if (_ = D[s + 1], m = _[0] - E, d = _[1] - S, h === 0 && d === 0) {
        if (m <= 0 && f >= 0 || f <= 0 && m >= 0)
          return 0;
      } else if (d >= 0 && h <= 0 || d <= 0 && h >= 0) {
        if (c = nE(f, m, h, d, 0, 0), c === 0)
          return 0;
        (c > 0 && d > 0 && h <= 0 || c < 0 && d <= 0 && h > 0) && u++;
      }
      y = _, h = d, f = m;
    }
  }
  return u % 2 !== 0;
}
function Cr(n, r, e = {}) {
  if (!n)
    throw new Error("point is required");
  if (!r)
    throw new Error("polygon is required");
  const s = $e(n), u = _s(r), c = u.type, f = r.bbox;
  let h = u.coordinates;
  if (f && iE(s, f) === !1)
    return !1;
  c === "Polygon" && (h = [h]);
  let m = !1;
  for (var d = 0; d < h.length; ++d) {
    const y = rE(s, h[d]);
    if (y === 0) return !e.ignoreBoundary;
    y && (m = !0);
  }
  return m;
}
function iE(n, r) {
  return r[0] <= n[0] && r[1] <= n[1] && r[2] >= n[0] && r[3] >= n[1];
}
class rg {
  constructor(r = [], e = sE) {
    if (this.data = r, this.length = this.data.length, this.compare = e, this.length > 0)
      for (let s = (this.length >> 1) - 1; s >= 0; s--) this._down(s);
  }
  push(r) {
    this.data.push(r), this.length++, this._up(this.length - 1);
  }
  pop() {
    if (this.length === 0) return;
    const r = this.data[0], e = this.data.pop();
    return this.length--, this.length > 0 && (this.data[0] = e, this._down(0)), r;
  }
  peek() {
    return this.data[0];
  }
  _up(r) {
    const { data: e, compare: s } = this, u = e[r];
    for (; r > 0; ) {
      const c = r - 1 >> 1, f = e[c];
      if (s(u, f) >= 0) break;
      e[r] = f, r = c;
    }
    e[r] = u;
  }
  _down(r) {
    const { data: e, compare: s } = this, u = this.length >> 1, c = e[r];
    for (; r < u; ) {
      let f = (r << 1) + 1, h = e[f];
      const m = f + 1;
      if (m < this.length && s(e[m], h) < 0 && (f = m, h = e[m]), s(h, c) >= 0) break;
      e[r] = h, r = f;
    }
    e[r] = c;
  }
}
function sE(n, r) {
  return n < r ? -1 : n > r ? 1 : 0;
}
function ig(n, r) {
  return n.p.x > r.p.x ? 1 : n.p.x < r.p.x ? -1 : n.p.y !== r.p.y ? n.p.y > r.p.y ? 1 : -1 : 1;
}
function aE(n, r) {
  return n.rightSweepEvent.p.x > r.rightSweepEvent.p.x ? 1 : n.rightSweepEvent.p.x < r.rightSweepEvent.p.x ? -1 : n.rightSweepEvent.p.y !== r.rightSweepEvent.p.y ? n.rightSweepEvent.p.y < r.rightSweepEvent.p.y ? 1 : -1 : 1;
}
class qc {
  constructor(r, e, s, u) {
    this.p = {
      x: r[0],
      y: r[1]
    }, this.featureId = e, this.ringId = s, this.eventId = u, this.otherEvent = null, this.isLeftEndpoint = null;
  }
  isSamePoint(r) {
    return this.p.x === r.p.x && this.p.y === r.p.y;
  }
}
function oE(n, r) {
  if (n.type === "FeatureCollection") {
    const e = n.features;
    for (let s = 0; s < e.length; s++)
      Yc(e[s], r);
  } else
    Yc(n, r);
}
let Ps = 0, Rs = 0, Ds = 0;
function Yc(n, r) {
  const e = n.type === "Feature" ? n.geometry : n;
  let s = e.coordinates;
  (e.type === "Polygon" || e.type === "MultiLineString") && (s = [s]), e.type === "LineString" && (s = [[s]]);
  for (let u = 0; u < s.length; u++)
    for (let c = 0; c < s[u].length; c++) {
      let f = s[u][c][0], h = null;
      Rs = Rs + 1;
      for (let m = 0; m < s[u][c].length - 1; m++) {
        h = s[u][c][m + 1];
        const d = new qc(f, Ps, Rs, Ds), y = new qc(h, Ps, Rs, Ds + 1);
        d.otherEvent = y, y.otherEvent = d, ig(d, y) > 0 ? (y.isLeftEndpoint = !0, d.isLeftEndpoint = !1) : (d.isLeftEndpoint = !0, y.isLeftEndpoint = !1), r.push(d), r.push(y), f = h, Ds = Ds + 1;
      }
    }
  Ps = Ps + 1;
}
let uE = class {
  constructor(r) {
    this.leftSweepEvent = r, this.rightSweepEvent = r.otherEvent;
  }
};
function lE(n, r) {
  if (n === null || r === null || n.leftSweepEvent.ringId === r.leftSweepEvent.ringId && (n.rightSweepEvent.isSamePoint(r.leftSweepEvent) || n.rightSweepEvent.isSamePoint(r.leftSweepEvent) || n.rightSweepEvent.isSamePoint(r.rightSweepEvent) || n.leftSweepEvent.isSamePoint(r.leftSweepEvent) || n.leftSweepEvent.isSamePoint(r.rightSweepEvent))) return !1;
  const e = n.leftSweepEvent.p.x, s = n.leftSweepEvent.p.y, u = n.rightSweepEvent.p.x, c = n.rightSweepEvent.p.y, f = r.leftSweepEvent.p.x, h = r.leftSweepEvent.p.y, m = r.rightSweepEvent.p.x, d = r.rightSweepEvent.p.y, y = (d - h) * (u - e) - (m - f) * (c - s), _ = (m - f) * (s - h) - (d - h) * (e - f), E = (u - e) * (s - h) - (c - s) * (e - f);
  if (y === 0)
    return !1;
  const S = _ / y, I = E / y;
  if (S >= 0 && S <= 1 && I >= 0 && I <= 1) {
    const D = e + S * (u - e), q = s + S * (c - s);
    return [D, q];
  }
  return !1;
}
function cE(n, r) {
  r = r || !1;
  const e = [], s = new rg([], aE);
  for (; n.length; ) {
    const u = n.pop();
    if (u.isLeftEndpoint) {
      const c = new uE(u);
      for (let f = 0; f < s.data.length; f++) {
        const h = s.data[f];
        if (r && h.leftSweepEvent.featureId === u.featureId)
          continue;
        const m = lE(c, h);
        m !== !1 && e.push(m);
      }
      s.push(c);
    } else u.isLeftEndpoint === !1 && s.pop();
  }
  return e;
}
function hE(n, r) {
  const e = new rg([], ig);
  return oE(n, e), cE(e, r);
}
var fE = hE;
function ks(n, r, e = {}) {
  const { removeDuplicates: s = !0, ignoreSelfIntersections: u = !0 } = e;
  let c = [];
  n.type === "FeatureCollection" ? c = c.concat(n.features) : n.type === "Feature" ? c.push(n) : (n.type === "LineString" || n.type === "Polygon" || n.type === "MultiLineString" || n.type === "MultiPolygon") && c.push(cn(n)), r.type === "FeatureCollection" ? c = c.concat(r.features) : r.type === "Feature" ? c.push(r) : (r.type === "LineString" || r.type === "Polygon" || r.type === "MultiLineString" || r.type === "MultiPolygon") && c.push(cn(r));
  const f = fE(
    Ke(c),
    u
  );
  let h = [];
  if (s) {
    const m = {};
    f.forEach((d) => {
      const y = d.join(",");
      m[y] || (m[y] = !0, h.push(d));
    });
  } else
    h = f;
  return Ke(h.map((m) => Un(m)));
}
var gE = ks;
function Va(n) {
  if (!n)
    throw new Error("geojson is required");
  switch (n.type) {
    case "Feature":
      return sg(n);
    case "FeatureCollection":
      return dE(n);
    case "Point":
    case "LineString":
    case "Polygon":
    case "MultiPoint":
    case "MultiLineString":
    case "MultiPolygon":
    case "GeometryCollection":
      return ju(n);
    default:
      throw new Error("unknown GeoJSON type");
  }
}
function sg(n) {
  const r = { type: "Feature" };
  return Object.keys(n).forEach((e) => {
    switch (e) {
      case "type":
      case "properties":
      case "geometry":
        return;
      default:
        r[e] = n[e];
    }
  }), r.properties = ag(n.properties), n.geometry == null ? r.geometry = null : r.geometry = ju(n.geometry), r;
}
function ag(n) {
  const r = {};
  return n && Object.keys(n).forEach((e) => {
    const s = n[e];
    typeof s == "object" ? s === null ? r[e] = null : Array.isArray(s) ? r[e] = s.map((u) => u) : r[e] = ag(s) : r[e] = s;
  }), r;
}
function dE(n) {
  const r = { type: "FeatureCollection" };
  return Object.keys(n).forEach((e) => {
    switch (e) {
      case "type":
      case "features":
        return;
      default:
        r[e] = n[e];
    }
  }), r.features = n.features.map((e) => sg(e)), r;
}
function ju(n) {
  const r = { type: n.type };
  return n.bbox && (r.bbox = n.bbox), n.type === "GeometryCollection" ? (r.geometries = n.geometries.map((e) => ju(e)), r) : (r.coordinates = og(n.coordinates), r);
}
function og(n) {
  const r = n;
  return typeof r[0] != "object" ? r.slice() : r.map((e) => og(e));
}
var ug = Va;
function Qo(n) {
  const r = Pt(n);
  let e = 0, s = 1, u, c;
  for (; s < r.length; )
    u = c || r[0], c = r[s], e += (c[0] - u[0]) * (c[1] + u[1]), s++;
  return e > 0;
}
function pE(n, r = {}) {
  var e, s;
  if (r = r || {}, !Tu(r)) throw new Error("options is invalid");
  const u = (e = r.mutate) != null ? e : !1, c = (s = r.reverse) != null ? s : !1;
  if (!n) throw new Error("<geojson> is required");
  if (typeof c != "boolean")
    throw new Error("<reverse> must be a boolean");
  if (typeof u != "boolean")
    throw new Error("<mutate> must be a boolean");
  !u && n.type !== "Point" && n.type !== "MultiPoint" && (n = Va(n));
  const f = [];
  switch (n.type) {
    case "GeometryCollection":
      return gr(n, function(h) {
        Qs(h, c);
      }), n;
    case "FeatureCollection":
      return Tn(n, function(h) {
        const m = Qs(h, c);
        Tn(m, function(d) {
          f.push(d);
        });
      }), Ke(f);
  }
  return Qs(n, c);
}
function Qs(n, r) {
  switch (n.type === "Feature" ? n.geometry.type : n.type) {
    case "GeometryCollection":
      return gr(n, function(s) {
        Qs(s, r);
      }), n;
    case "LineString":
      return Hc(Pt(n), r), n;
    case "Polygon":
      return Jc(Pt(n), r), n;
    case "MultiLineString":
      return Pt(n).forEach(function(s) {
        Hc(s, r);
      }), n;
    case "MultiPolygon":
      return Pt(n).forEach(function(s) {
        Jc(s, r);
      }), n;
    case "Point":
    case "MultiPoint":
      return n;
  }
}
function Hc(n, r) {
  Qo(n) === r && n.reverse();
}
function Jc(n, r) {
  Qo(n[0]) !== r && n[0].reverse();
  for (let e = 1; e < n.length; e++)
    Qo(n[e]) === r && n[e].reverse();
}
var mE = pE;
const vE = ["Point", "MultiPoint"], yE = [
  "LineString",
  "MultiLineString",
  "Polygon",
  "MultiPolygon"
], lg = (n) => vE.includes(n.geometry.type), eu = (n) => yE.includes(n.geometry.type);
function _E(n, r = {}) {
  const e = wn(n), s = (e[0] + e[2]) / 2, u = (e[1] + e[3]) / 2;
  return Un([s, u], r.properties, r);
}
var ea = { exports: {} }, EE = ea.exports, Vc;
function xE() {
  return Vc || (Vc = 1, function(n, r) {
    (function(e, s) {
      n.exports = s();
    })(EE, function() {
      function e(o, t) {
        (t == null || t > o.length) && (t = o.length);
        for (var i = 0, a = Array(t); i < t; i++) a[i] = o[i];
        return a;
      }
      function s(o, t, i) {
        return t = y(t), function(a, l) {
          if (l && (typeof l == "object" || typeof l == "function")) return l;
          if (l !== void 0) throw new TypeError("Derived constructors may only return object or undefined");
          return function(g) {
            if (g === void 0) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return g;
          }(a);
        }(o, E() ? Reflect.construct(t, i || [], y(o).constructor) : t.apply(o, i));
      }
      function u(o, t) {
        if (!(o instanceof t)) throw new TypeError("Cannot call a class as a function");
      }
      function c(o, t, i) {
        if (E()) return Reflect.construct.apply(null, arguments);
        var a = [null];
        a.push.apply(a, t);
        var l = new (o.bind.apply(o, a))();
        return i && S(l, i.prototype), l;
      }
      function f(o, t) {
        for (var i = 0; i < t.length; i++) {
          var a = t[i];
          a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(o, q(a.key), a);
        }
      }
      function h(o, t, i) {
        return t && f(o.prototype, t), i && f(o, i), Object.defineProperty(o, "prototype", { writable: !1 }), o;
      }
      function m(o, t) {
        var i = typeof Symbol < "u" && o[Symbol.iterator] || o["@@iterator"];
        if (!i) {
          if (Array.isArray(o) || (i = G(o)) || t) {
            i && (o = i);
            var a = 0, l = function() {
            };
            return { s: l, n: function() {
              return a >= o.length ? { done: !0 } : { done: !1, value: o[a++] };
            }, e: function(w) {
              throw w;
            }, f: l };
          }
          throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
        }
        var g, p = !0, v = !1;
        return { s: function() {
          i = i.call(o);
        }, n: function() {
          var w = i.next();
          return p = w.done, w;
        }, e: function(w) {
          v = !0, g = w;
        }, f: function() {
          try {
            p || i.return == null || i.return();
          } finally {
            if (v) throw g;
          }
        } };
      }
      function d() {
        return d = typeof Reflect < "u" && Reflect.get ? Reflect.get.bind() : function(o, t, i) {
          var a = function(g, p) {
            for (; !{}.hasOwnProperty.call(g, p) && (g = y(g)) !== null; ) ;
            return g;
          }(o, t);
          if (a) {
            var l = Object.getOwnPropertyDescriptor(a, t);
            return l.get ? l.get.call(arguments.length < 3 ? o : i) : l.value;
          }
        }, d.apply(null, arguments);
      }
      function y(o) {
        return y = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(t) {
          return t.__proto__ || Object.getPrototypeOf(t);
        }, y(o);
      }
      function _(o, t) {
        if (typeof t != "function" && t !== null) throw new TypeError("Super expression must either be null or a function");
        o.prototype = Object.create(t && t.prototype, { constructor: { value: o, writable: !0, configurable: !0 } }), Object.defineProperty(o, "prototype", { writable: !1 }), t && S(o, t);
      }
      function E() {
        try {
          var o = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
          }));
        } catch {
        }
        return (E = function() {
          return !!o;
        })();
      }
      function S(o, t) {
        return S = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(i, a) {
          return i.__proto__ = a, i;
        }, S(o, t);
      }
      function I(o, t, i, a) {
        var l = d(y(1 & a ? o.prototype : o), t, i);
        return 2 & a && typeof l == "function" ? function(g) {
          return l.apply(i, g);
        } : l;
      }
      function D(o) {
        return function(t) {
          if (Array.isArray(t)) return e(t);
        }(o) || function(t) {
          if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
        }(o) || G(o) || function() {
          throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
        }();
      }
      function q(o) {
        var t = function(i, a) {
          if (typeof i != "object" || !i) return i;
          var l = i[Symbol.toPrimitive];
          if (l !== void 0) {
            var g = l.call(i, a);
            if (typeof g != "object") return g;
            throw new TypeError("@@toPrimitive must return a primitive value.");
          }
          return String(i);
        }(o, "string");
        return typeof t == "symbol" ? t : t + "";
      }
      function G(o, t) {
        if (o) {
          if (typeof o == "string") return e(o, t);
          var i = {}.toString.call(o).slice(8, -1);
          return i === "Object" && o.constructor && (i = o.constructor.name), i === "Map" || i === "Set" ? Array.from(o) : i === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i) ? e(o, t) : void 0;
        }
      }
      function M(o) {
        var t = typeof Map == "function" ? /* @__PURE__ */ new Map() : void 0;
        return M = function(i) {
          if (i === null || !function(l) {
            try {
              return Function.toString.call(l).indexOf("[native code]") !== -1;
            } catch {
              return typeof l == "function";
            }
          }(i)) return i;
          if (typeof i != "function") throw new TypeError("Super expression must either be null or a function");
          if (t !== void 0) {
            if (t.has(i)) return t.get(i);
            t.set(i, a);
          }
          function a() {
            return c(i, arguments, y(this).constructor);
          }
          return a.prototype = Object.create(i.prototype, { constructor: { value: a, enumerable: !1, writable: !0, configurable: !0 } }), S(a, i);
        }, M(o);
      }
      var H = function() {
        function o() {
          u(this, o), o.constructor_.apply(this, arguments);
        }
        return h(o, [{ key: "getEndCapStyle", value: function() {
          return this._endCapStyle;
        } }, { key: "isSingleSided", value: function() {
          return this._isSingleSided;
        } }, { key: "setQuadrantSegments", value: function(t) {
          this._quadrantSegments = t, this._quadrantSegments === 0 && (this._joinStyle = o.JOIN_BEVEL), this._quadrantSegments < 0 && (this._joinStyle = o.JOIN_MITRE, this._mitreLimit = Math.abs(this._quadrantSegments)), t <= 0 && (this._quadrantSegments = 1), this._joinStyle !== o.JOIN_ROUND && (this._quadrantSegments = o.DEFAULT_QUADRANT_SEGMENTS);
        } }, { key: "getJoinStyle", value: function() {
          return this._joinStyle;
        } }, { key: "setJoinStyle", value: function(t) {
          this._joinStyle = t;
        } }, { key: "setSimplifyFactor", value: function(t) {
          this._simplifyFactor = t < 0 ? 0 : t;
        } }, { key: "getSimplifyFactor", value: function() {
          return this._simplifyFactor;
        } }, { key: "getQuadrantSegments", value: function() {
          return this._quadrantSegments;
        } }, { key: "setEndCapStyle", value: function(t) {
          this._endCapStyle = t;
        } }, { key: "getMitreLimit", value: function() {
          return this._mitreLimit;
        } }, { key: "setMitreLimit", value: function(t) {
          this._mitreLimit = t;
        } }, { key: "setSingleSided", value: function(t) {
          this._isSingleSided = t;
        } }], [{ key: "constructor_", value: function() {
          if (this._quadrantSegments = o.DEFAULT_QUADRANT_SEGMENTS, this._endCapStyle = o.CAP_ROUND, this._joinStyle = o.JOIN_ROUND, this._mitreLimit = o.DEFAULT_MITRE_LIMIT, this._isSingleSided = !1, this._simplifyFactor = o.DEFAULT_SIMPLIFY_FACTOR, arguments.length !== 0) {
            if (arguments.length === 1) {
              var t = arguments[0];
              this.setQuadrantSegments(t);
            } else if (arguments.length === 2) {
              var i = arguments[0], a = arguments[1];
              this.setQuadrantSegments(i), this.setEndCapStyle(a);
            } else if (arguments.length === 4) {
              var l = arguments[0], g = arguments[1], p = arguments[2], v = arguments[3];
              this.setQuadrantSegments(l), this.setEndCapStyle(g), this.setJoinStyle(p), this.setMitreLimit(v);
            }
          }
        } }, { key: "bufferDistanceError", value: function(t) {
          var i = Math.PI / 2 / t;
          return 1 - Math.cos(i / 2);
        } }]);
      }();
      H.CAP_ROUND = 1, H.CAP_FLAT = 2, H.CAP_SQUARE = 3, H.JOIN_ROUND = 1, H.JOIN_MITRE = 2, H.JOIN_BEVEL = 3, H.DEFAULT_QUADRANT_SEGMENTS = 8, H.DEFAULT_MITRE_LIMIT = 5, H.DEFAULT_SIMPLIFY_FACTOR = 0.01;
      var V = function(o) {
        function t(i) {
          var a;
          return u(this, t), (a = s(this, t, [i])).name = Object.keys({ Exception: t })[0], a;
        }
        return _(t, o), h(t, [{ key: "toString", value: function() {
          return this.message;
        } }]);
      }(M(Error)), X = function(o) {
        function t(i) {
          var a;
          return u(this, t), (a = s(this, t, [i])).name = Object.keys({ IllegalArgumentException: t })[0], a;
        }
        return _(t, o), h(t);
      }(V), j = function() {
        return h(function o() {
          u(this, o);
        }, [{ key: "filter", value: function(o) {
        } }]);
      }();
      function $() {
      }
      function x() {
      }
      function k() {
      }
      var T, L, A, F, O, N, P, Y, U = function() {
        return h(function o() {
          u(this, o);
        }, null, [{ key: "equalsWithTolerance", value: function(o, t, i) {
          return Math.abs(o - t) <= i;
        } }]);
      }(), Z = function() {
        return h(function o(t, i) {
          u(this, o), this.low = i || 0, this.high = t || 0;
        }, null, [{ key: "toBinaryString", value: function(o) {
          var t, i = "";
          for (t = 2147483648; t > 0; t >>>= 1) i += (o.high & t) === t ? "1" : "0";
          for (t = 2147483648; t > 0; t >>>= 1) i += (o.low & t) === t ? "1" : "0";
          return i;
        } }]);
      }();
      function K() {
      }
      function re() {
      }
      K.NaN = NaN, K.isNaN = function(o) {
        return Number.isNaN(o);
      }, K.isInfinite = function(o) {
        return !Number.isFinite(o);
      }, K.MAX_VALUE = Number.MAX_VALUE, K.POSITIVE_INFINITY = Number.POSITIVE_INFINITY, K.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY, typeof Float64Array == "function" && typeof Int32Array == "function" ? (N = 2146435072, P = new Float64Array(1), Y = new Int32Array(P.buffer), K.doubleToLongBits = function(o) {
        P[0] = o;
        var t = 0 | Y[0], i = 0 | Y[1];
        return (i & N) === N && 1048575 & i && t !== 0 && (t = 0, i = 2146959360), new Z(i, t);
      }, K.longBitsToDouble = function(o) {
        return Y[0] = o.low, Y[1] = o.high, P[0];
      }) : (T = 1023, L = Math.log2, A = Math.floor, F = Math.pow, O = function() {
        for (var o = 53; o > 0; o--) {
          var t = F(2, o) - 1;
          if (A(L(t)) + 1 === o) return t;
        }
        return 0;
      }(), K.doubleToLongBits = function(o) {
        var t, i, a, l, g, p, v, w, b;
        if (o < 0 || 1 / o === Number.NEGATIVE_INFINITY ? (p = 1 << 31, o = -o) : p = 0, o === 0) return new Z(w = p, b = 0);
        if (o === 1 / 0) return new Z(w = 2146435072 | p, b = 0);
        if (o != o) return new Z(w = 2146959360, b = 0);
        if (l = 0, b = 0, (t = A(o)) > 1) if (t <= O) (l = A(L(t))) <= 20 ? (b = 0, w = t << 20 - l & 1048575) : (b = t % (i = F(2, a = l - 20)) << 32 - a, w = t / i & 1048575);
        else for (a = t, b = 0; (a = A(i = a / 2)) !== 0; ) l++, b >>>= 1, b |= (1 & w) << 31, w >>>= 1, i !== a && (w |= 524288);
        if (v = l + T, g = t === 0, t = o - t, l < 52 && t !== 0) for (a = 0; ; ) {
          if ((i = 2 * t) >= 1 ? (t = i - 1, g ? (v--, g = !1) : (a <<= 1, a |= 1, l++)) : (t = i, g ? --v == 0 && (l++, g = !1) : (a <<= 1, l++)), l === 20) w |= a, a = 0;
          else if (l === 52) {
            b |= a;
            break;
          }
          if (i === 1) {
            l < 20 ? w |= a << 20 - l : l < 52 && (b |= a << 52 - l);
            break;
          }
        }
        return w |= v << 20, new Z(w |= p, b);
      }, K.longBitsToDouble = function(o) {
        var t, i, a, l, g = o.high, p = o.low, v = g & 1 << 31 ? -1 : 1;
        for (a = ((2146435072 & g) >> 20) - T, l = 0, i = 1 << 19, t = 1; t <= 20; t++) g & i && (l += F(2, -t)), i >>>= 1;
        for (i = 1 << 31, t = 21; t <= 52; t++) p & i && (l += F(2, -t)), i >>>= 1;
        if (a === -1023) {
          if (l === 0) return 0 * v;
          a = -1022;
        } else {
          if (a === 1024) return l === 0 ? v / 0 : NaN;
          l += 1;
        }
        return v * l * F(2, a);
      });
      var de = function(o) {
        function t(i) {
          var a;
          return u(this, t), (a = s(this, t, [i])).name = Object.keys({ RuntimeException: t })[0], a;
        }
        return _(t, o), h(t);
      }(V), ce = function(o) {
        function t() {
          var i;
          return u(this, t), i = s(this, t), t.constructor_.apply(i, arguments), i;
        }
        return _(t, o), h(t, null, [{ key: "constructor_", value: function() {
          if (arguments.length === 0) de.constructor_.call(this);
          else if (arguments.length === 1) {
            var i = arguments[0];
            de.constructor_.call(this, i);
          }
        } }]);
      }(de), se = function() {
        function o() {
          u(this, o);
        }
        return h(o, null, [{ key: "shouldNeverReachHere", value: function() {
          if (arguments.length === 0) o.shouldNeverReachHere(null);
          else if (arguments.length === 1) {
            var t = arguments[0];
            throw new ce("Should never reach here" + (t !== null ? ": " + t : ""));
          }
        } }, { key: "isTrue", value: function() {
          if (arguments.length === 1) {
            var t = arguments[0];
            o.isTrue(t, null);
          } else if (arguments.length === 2) {
            var i = arguments[1];
            if (!arguments[0]) throw i === null ? new ce() : new ce(i);
          }
        } }, { key: "equals", value: function() {
          if (arguments.length === 2) {
            var t = arguments[0], i = arguments[1];
            o.equals(t, i, null);
          } else if (arguments.length === 3) {
            var a = arguments[0], l = arguments[1], g = arguments[2];
            if (!l.equals(a)) throw new ce("Expected " + a + " but encountered " + l + (g !== null ? ": " + g : ""));
          }
        } }]);
      }(), ue = new ArrayBuffer(8), xe = new Float64Array(ue), Le = new Int32Array(ue), J = function() {
        function o() {
          u(this, o), o.constructor_.apply(this, arguments);
        }
        return h(o, [{ key: "getM", value: function() {
          return K.NaN;
        } }, { key: "setOrdinate", value: function(t, i) {
          switch (t) {
            case o.X:
              this.x = i;
              break;
            case o.Y:
              this.y = i;
              break;
            case o.Z:
              this.setZ(i);
              break;
            default:
              throw new X("Invalid ordinate index: " + t);
          }
        } }, { key: "equals2D", value: function() {
          if (arguments.length === 1) {
            var t = arguments[0];
            return this.x === t.x && this.y === t.y;
          }
          if (arguments.length === 2) {
            var i = arguments[0], a = arguments[1];
            return !!U.equalsWithTolerance(this.x, i.x, a) && !!U.equalsWithTolerance(this.y, i.y, a);
          }
        } }, { key: "setM", value: function(t) {
          throw new X("Invalid ordinate index: " + o.M);
        } }, { key: "getZ", value: function() {
          return this.z;
        } }, { key: "getOrdinate", value: function(t) {
          switch (t) {
            case o.X:
              return this.x;
            case o.Y:
              return this.y;
            case o.Z:
              return this.getZ();
          }
          throw new X("Invalid ordinate index: " + t);
        } }, { key: "equals3D", value: function(t) {
          return this.x === t.x && this.y === t.y && (this.getZ() === t.getZ() || K.isNaN(this.getZ()) && K.isNaN(t.getZ()));
        } }, { key: "equals", value: function(t) {
          return t instanceof o && this.equals2D(t);
        } }, { key: "equalInZ", value: function(t, i) {
          return U.equalsWithTolerance(this.getZ(), t.getZ(), i);
        } }, { key: "setX", value: function(t) {
          this.x = t;
        } }, { key: "compareTo", value: function(t) {
          var i = t;
          return this.x < i.x ? -1 : this.x > i.x ? 1 : this.y < i.y ? -1 : this.y > i.y ? 1 : 0;
        } }, { key: "getX", value: function() {
          return this.x;
        } }, { key: "setZ", value: function(t) {
          this.z = t;
        } }, { key: "clone", value: function() {
          try {
            return null;
          } catch (t) {
            if (t instanceof CloneNotSupportedException) return se.shouldNeverReachHere("this shouldn't happen because this class is Cloneable"), null;
            throw t;
          }
        } }, { key: "copy", value: function() {
          return new o(this);
        } }, { key: "toString", value: function() {
          return "(" + this.x + ", " + this.y + ", " + this.getZ() + ")";
        } }, { key: "distance3D", value: function(t) {
          var i = this.x - t.x, a = this.y - t.y, l = this.getZ() - t.getZ();
          return Math.sqrt(i * i + a * a + l * l);
        } }, { key: "getY", value: function() {
          return this.y;
        } }, { key: "setY", value: function(t) {
          this.y = t;
        } }, { key: "distance", value: function(t) {
          var i = this.x - t.x, a = this.y - t.y;
          return Math.sqrt(i * i + a * a);
        } }, { key: "hashCode", value: function() {
          var t = 17;
          return t = 37 * (t = 37 * t + o.hashCode(this.x)) + o.hashCode(this.y);
        } }, { key: "setCoordinate", value: function(t) {
          this.x = t.x, this.y = t.y, this.z = t.getZ();
        } }, { key: "interfaces_", get: function() {
          return [$, x, k];
        } }], [{ key: "constructor_", value: function() {
          if (this.x = null, this.y = null, this.z = null, arguments.length === 0) o.constructor_.call(this, 0, 0);
          else if (arguments.length === 1) {
            var t = arguments[0];
            o.constructor_.call(this, t.x, t.y, t.getZ());
          } else if (arguments.length === 2) {
            var i = arguments[0], a = arguments[1];
            o.constructor_.call(this, i, a, o.NULL_ORDINATE);
          } else if (arguments.length === 3) {
            var l = arguments[0], g = arguments[1], p = arguments[2];
            this.x = l, this.y = g, this.z = p;
          }
        } }, { key: "hashCode", value: function(t) {
          return xe[0] = t, Le[0] ^ Le[1];
        } }]);
      }(), Kt = function() {
        function o() {
          u(this, o), o.constructor_.apply(this, arguments);
        }
        return h(o, [{ key: "compare", value: function(t, i) {
          var a = o.compare(t.x, i.x);
          if (a !== 0) return a;
          var l = o.compare(t.y, i.y);
          return l !== 0 ? l : this._dimensionsToTest <= 2 ? 0 : o.compare(t.getZ(), i.getZ());
        } }, { key: "interfaces_", get: function() {
          return [re];
        } }], [{ key: "constructor_", value: function() {
          if (this._dimensionsToTest = 2, arguments.length === 0) o.constructor_.call(this, 2);
          else if (arguments.length === 1) {
            var t = arguments[0];
            if (t !== 2 && t !== 3) throw new X("only 2 or 3 dimensions may be specified");
            this._dimensionsToTest = t;
          }
        } }, { key: "compare", value: function(t, i) {
          return t < i ? -1 : t > i ? 1 : K.isNaN(t) ? K.isNaN(i) ? 0 : -1 : K.isNaN(i) ? 1 : 0;
        } }]);
      }();
      J.DimensionalComparator = Kt, J.NULL_ORDINATE = K.NaN, J.X = 0, J.Y = 1, J.Z = 2, J.M = 3;
      var be = function() {
        function o() {
          u(this, o), o.constructor_.apply(this, arguments);
        }
        return h(o, [{ key: "getArea", value: function() {
          return this.getWidth() * this.getHeight();
        } }, { key: "equals", value: function(t) {
          if (!(t instanceof o)) return !1;
          var i = t;
          return this.isNull() ? i.isNull() : this._maxx === i.getMaxX() && this._maxy === i.getMaxY() && this._minx === i.getMinX() && this._miny === i.getMinY();
        } }, { key: "intersection", value: function(t) {
          if (this.isNull() || t.isNull() || !this.intersects(t)) return new o();
          var i = this._minx > t._minx ? this._minx : t._minx, a = this._miny > t._miny ? this._miny : t._miny;
          return new o(i, this._maxx < t._maxx ? this._maxx : t._maxx, a, this._maxy < t._maxy ? this._maxy : t._maxy);
        } }, { key: "isNull", value: function() {
          return this._maxx < this._minx;
        } }, { key: "getMaxX", value: function() {
          return this._maxx;
        } }, { key: "covers", value: function() {
          if (arguments.length === 1) {
            if (arguments[0] instanceof J) {
              var t = arguments[0];
              return this.covers(t.x, t.y);
            }
            if (arguments[0] instanceof o) {
              var i = arguments[0];
              return !this.isNull() && !i.isNull() && i.getMinX() >= this._minx && i.getMaxX() <= this._maxx && i.getMinY() >= this._miny && i.getMaxY() <= this._maxy;
            }
          } else if (arguments.length === 2) {
            var a = arguments[0], l = arguments[1];
            return !this.isNull() && a >= this._minx && a <= this._maxx && l >= this._miny && l <= this._maxy;
          }
        } }, { key: "intersects", value: function() {
          if (arguments.length === 1) {
            if (arguments[0] instanceof o) {
              var t = arguments[0];
              return !this.isNull() && !t.isNull() && !(t._minx > this._maxx || t._maxx < this._minx || t._miny > this._maxy || t._maxy < this._miny);
            }
            if (arguments[0] instanceof J) {
              var i = arguments[0];
              return this.intersects(i.x, i.y);
            }
          } else if (arguments.length === 2) {
            if (arguments[0] instanceof J && arguments[1] instanceof J) {
              var a = arguments[0], l = arguments[1];
              return !this.isNull() && !((a.x < l.x ? a.x : l.x) > this._maxx) && !((a.x > l.x ? a.x : l.x) < this._minx) && !((a.y < l.y ? a.y : l.y) > this._maxy) && !((a.y > l.y ? a.y : l.y) < this._miny);
            }
            if (typeof arguments[0] == "number" && typeof arguments[1] == "number") {
              var g = arguments[0], p = arguments[1];
              return !this.isNull() && !(g > this._maxx || g < this._minx || p > this._maxy || p < this._miny);
            }
          }
        } }, { key: "getMinY", value: function() {
          return this._miny;
        } }, { key: "getDiameter", value: function() {
          if (this.isNull()) return 0;
          var t = this.getWidth(), i = this.getHeight();
          return Math.sqrt(t * t + i * i);
        } }, { key: "getMinX", value: function() {
          return this._minx;
        } }, { key: "expandToInclude", value: function() {
          if (arguments.length === 1) {
            if (arguments[0] instanceof J) {
              var t = arguments[0];
              this.expandToInclude(t.x, t.y);
            } else if (arguments[0] instanceof o) {
              var i = arguments[0];
              if (i.isNull()) return null;
              this.isNull() ? (this._minx = i.getMinX(), this._maxx = i.getMaxX(), this._miny = i.getMinY(), this._maxy = i.getMaxY()) : (i._minx < this._minx && (this._minx = i._minx), i._maxx > this._maxx && (this._maxx = i._maxx), i._miny < this._miny && (this._miny = i._miny), i._maxy > this._maxy && (this._maxy = i._maxy));
            }
          } else if (arguments.length === 2) {
            var a = arguments[0], l = arguments[1];
            this.isNull() ? (this._minx = a, this._maxx = a, this._miny = l, this._maxy = l) : (a < this._minx && (this._minx = a), a > this._maxx && (this._maxx = a), l < this._miny && (this._miny = l), l > this._maxy && (this._maxy = l));
          }
        } }, { key: "minExtent", value: function() {
          if (this.isNull()) return 0;
          var t = this.getWidth(), i = this.getHeight();
          return t < i ? t : i;
        } }, { key: "getWidth", value: function() {
          return this.isNull() ? 0 : this._maxx - this._minx;
        } }, { key: "compareTo", value: function(t) {
          var i = t;
          return this.isNull() ? i.isNull() ? 0 : -1 : i.isNull() ? 1 : this._minx < i._minx ? -1 : this._minx > i._minx ? 1 : this._miny < i._miny ? -1 : this._miny > i._miny ? 1 : this._maxx < i._maxx ? -1 : this._maxx > i._maxx ? 1 : this._maxy < i._maxy ? -1 : this._maxy > i._maxy ? 1 : 0;
        } }, { key: "translate", value: function(t, i) {
          if (this.isNull()) return null;
          this.init(this.getMinX() + t, this.getMaxX() + t, this.getMinY() + i, this.getMaxY() + i);
        } }, { key: "copy", value: function() {
          return new o(this);
        } }, { key: "toString", value: function() {
          return "Env[" + this._minx + " : " + this._maxx + ", " + this._miny + " : " + this._maxy + "]";
        } }, { key: "setToNull", value: function() {
          this._minx = 0, this._maxx = -1, this._miny = 0, this._maxy = -1;
        } }, { key: "disjoint", value: function(t) {
          return !(!this.isNull() && !t.isNull()) || t._minx > this._maxx || t._maxx < this._minx || t._miny > this._maxy || t._maxy < this._miny;
        } }, { key: "getHeight", value: function() {
          return this.isNull() ? 0 : this._maxy - this._miny;
        } }, { key: "maxExtent", value: function() {
          if (this.isNull()) return 0;
          var t = this.getWidth(), i = this.getHeight();
          return t > i ? t : i;
        } }, { key: "expandBy", value: function() {
          if (arguments.length === 1) {
            var t = arguments[0];
            this.expandBy(t, t);
          } else if (arguments.length === 2) {
            var i = arguments[0], a = arguments[1];
            if (this.isNull()) return null;
            this._minx -= i, this._maxx += i, this._miny -= a, this._maxy += a, (this._minx > this._maxx || this._miny > this._maxy) && this.setToNull();
          }
        } }, { key: "contains", value: function() {
          if (arguments.length === 1) {
            if (arguments[0] instanceof o) {
              var t = arguments[0];
              return this.covers(t);
            }
            if (arguments[0] instanceof J) {
              var i = arguments[0];
              return this.covers(i);
            }
          } else if (arguments.length === 2) {
            var a = arguments[0], l = arguments[1];
            return this.covers(a, l);
          }
        } }, { key: "centre", value: function() {
          return this.isNull() ? null : new J((this.getMinX() + this.getMaxX()) / 2, (this.getMinY() + this.getMaxY()) / 2);
        } }, { key: "init", value: function() {
          if (arguments.length === 0) this.setToNull();
          else if (arguments.length === 1) {
            if (arguments[0] instanceof J) {
              var t = arguments[0];
              this.init(t.x, t.x, t.y, t.y);
            } else if (arguments[0] instanceof o) {
              var i = arguments[0];
              this._minx = i._minx, this._maxx = i._maxx, this._miny = i._miny, this._maxy = i._maxy;
            }
          } else if (arguments.length === 2) {
            var a = arguments[0], l = arguments[1];
            this.init(a.x, l.x, a.y, l.y);
          } else if (arguments.length === 4) {
            var g = arguments[0], p = arguments[1], v = arguments[2], w = arguments[3];
            g < p ? (this._minx = g, this._maxx = p) : (this._minx = p, this._maxx = g), v < w ? (this._miny = v, this._maxy = w) : (this._miny = w, this._maxy = v);
          }
        } }, { key: "getMaxY", value: function() {
          return this._maxy;
        } }, { key: "distance", value: function(t) {
          if (this.intersects(t)) return 0;
          var i = 0;
          this._maxx < t._minx ? i = t._minx - this._maxx : this._minx > t._maxx && (i = this._minx - t._maxx);
          var a = 0;
          return this._maxy < t._miny ? a = t._miny - this._maxy : this._miny > t._maxy && (a = this._miny - t._maxy), i === 0 ? a : a === 0 ? i : Math.sqrt(i * i + a * a);
        } }, { key: "hashCode", value: function() {
          var t = 17;
          return t = 37 * (t = 37 * (t = 37 * (t = 37 * t + J.hashCode(this._minx)) + J.hashCode(this._maxx)) + J.hashCode(this._miny)) + J.hashCode(this._maxy);
        } }, { key: "interfaces_", get: function() {
          return [$, k];
        } }], [{ key: "constructor_", value: function() {
          if (this._minx = null, this._maxx = null, this._miny = null, this._maxy = null, arguments.length === 0) this.init();
          else if (arguments.length === 1) {
            if (arguments[0] instanceof J) {
              var t = arguments[0];
              this.init(t.x, t.x, t.y, t.y);
            } else if (arguments[0] instanceof o) {
              var i = arguments[0];
              this.init(i);
            }
          } else if (arguments.length === 2) {
            var a = arguments[0], l = arguments[1];
            this.init(a.x, l.x, a.y, l.y);
          } else if (arguments.length === 4) {
            var g = arguments[0], p = arguments[1], v = arguments[2], w = arguments[3];
            this.init(g, p, v, w);
          }
        } }, { key: "intersects", value: function() {
          if (arguments.length === 3) {
            var t = arguments[0], i = arguments[1], a = arguments[2];
            return a.x >= (t.x < i.x ? t.x : i.x) && a.x <= (t.x > i.x ? t.x : i.x) && a.y >= (t.y < i.y ? t.y : i.y) && a.y <= (t.y > i.y ? t.y : i.y);
          }
          if (arguments.length === 4) {
            var l = arguments[0], g = arguments[1], p = arguments[2], v = arguments[3], w = Math.min(p.x, v.x), b = Math.max(p.x, v.x), z = Math.min(l.x, g.x), W = Math.max(l.x, g.x);
            return !(z > b) && !(W < w) && (w = Math.min(p.y, v.y), b = Math.max(p.y, v.y), z = Math.min(l.y, g.y), W = Math.max(l.y, g.y), !(z > b) && !(W < w));
          }
        } }]);
      }(), he = function() {
        function o() {
          u(this, o), o.constructor_.apply(this, arguments);
        }
        return h(o, [{ key: "isGeometryCollection", value: function() {
          return this.getTypeCode() === o.TYPECODE_GEOMETRYCOLLECTION;
        } }, { key: "getFactory", value: function() {
          return this._factory;
        } }, { key: "getGeometryN", value: function(t) {
          return this;
        } }, { key: "getArea", value: function() {
          return 0;
        } }, { key: "isRectangle", value: function() {
          return !1;
        } }, { key: "equalsExact", value: function(t) {
          return this === t || this.equalsExact(t, 0);
        } }, { key: "geometryChanged", value: function() {
          this.apply(o.geometryChangedFilter);
        } }, { key: "geometryChangedAction", value: function() {
          this._envelope = null;
        } }, { key: "equalsNorm", value: function(t) {
          return t !== null && this.norm().equalsExact(t.norm());
        } }, { key: "getLength", value: function() {
          return 0;
        } }, { key: "getNumGeometries", value: function() {
          return 1;
        } }, { key: "compareTo", value: function() {
          var t;
          if (arguments.length === 1) {
            var i = arguments[0];
            return t = i, this.getTypeCode() !== t.getTypeCode() ? this.getTypeCode() - t.getTypeCode() : this.isEmpty() && t.isEmpty() ? 0 : this.isEmpty() ? -1 : t.isEmpty() ? 1 : this.compareToSameClass(i);
          }
          if (arguments.length === 2) {
            var a = arguments[0], l = arguments[1];
            return t = a, this.getTypeCode() !== t.getTypeCode() ? this.getTypeCode() - t.getTypeCode() : this.isEmpty() && t.isEmpty() ? 0 : this.isEmpty() ? -1 : t.isEmpty() ? 1 : this.compareToSameClass(a, l);
          }
        } }, { key: "getUserData", value: function() {
          return this._userData;
        } }, { key: "getSRID", value: function() {
          return this._SRID;
        } }, { key: "getEnvelope", value: function() {
          return this.getFactory().toGeometry(this.getEnvelopeInternal());
        } }, { key: "checkNotGeometryCollection", value: function(t) {
          if (t.getTypeCode() === o.TYPECODE_GEOMETRYCOLLECTION) throw new X("This method does not support GeometryCollection arguments");
        } }, { key: "equal", value: function(t, i, a) {
          return a === 0 ? t.equals(i) : t.distance(i) <= a;
        } }, { key: "norm", value: function() {
          var t = this.copy();
          return t.normalize(), t;
        } }, { key: "reverse", value: function() {
          var t = this.reverseInternal();
          return this.envelope != null && (t.envelope = this.envelope.copy()), t.setSRID(this.getSRID()), t;
        } }, { key: "copy", value: function() {
          var t = this.copyInternal();
          return t.envelope = this._envelope == null ? null : this._envelope.copy(), t._SRID = this._SRID, t._userData = this._userData, t;
        } }, { key: "getPrecisionModel", value: function() {
          return this._factory.getPrecisionModel();
        } }, { key: "getEnvelopeInternal", value: function() {
          return this._envelope === null && (this._envelope = this.computeEnvelopeInternal()), new be(this._envelope);
        } }, { key: "setSRID", value: function(t) {
          this._SRID = t;
        } }, { key: "setUserData", value: function(t) {
          this._userData = t;
        } }, { key: "compare", value: function(t, i) {
          for (var a = t.iterator(), l = i.iterator(); a.hasNext() && l.hasNext(); ) {
            var g = a.next(), p = l.next(), v = g.compareTo(p);
            if (v !== 0) return v;
          }
          return a.hasNext() ? 1 : l.hasNext() ? -1 : 0;
        } }, { key: "hashCode", value: function() {
          return this.getEnvelopeInternal().hashCode();
        } }, { key: "isEquivalentClass", value: function(t) {
          return this.getClass() === t.getClass();
        } }, { key: "isGeometryCollectionOrDerived", value: function() {
          return this.getTypeCode() === o.TYPECODE_GEOMETRYCOLLECTION || this.getTypeCode() === o.TYPECODE_MULTIPOINT || this.getTypeCode() === o.TYPECODE_MULTILINESTRING || this.getTypeCode() === o.TYPECODE_MULTIPOLYGON;
        } }, { key: "interfaces_", get: function() {
          return [x, $, k];
        } }, { key: "getClass", value: function() {
          return o;
        } }], [{ key: "hasNonEmptyElements", value: function(t) {
          for (var i = 0; i < t.length; i++) if (!t[i].isEmpty()) return !0;
          return !1;
        } }, { key: "hasNullElements", value: function(t) {
          for (var i = 0; i < t.length; i++) if (t[i] === null) return !0;
          return !1;
        } }]);
      }();
      he.constructor_ = function(o) {
        o && (this._envelope = null, this._userData = null, this._factory = o, this._SRID = o.getSRID());
      }, he.TYPECODE_POINT = 0, he.TYPECODE_MULTIPOINT = 1, he.TYPECODE_LINESTRING = 2, he.TYPECODE_LINEARRING = 3, he.TYPECODE_MULTILINESTRING = 4, he.TYPECODE_POLYGON = 5, he.TYPECODE_MULTIPOLYGON = 6, he.TYPECODE_GEOMETRYCOLLECTION = 7, he.TYPENAME_POINT = "Point", he.TYPENAME_MULTIPOINT = "MultiPoint", he.TYPENAME_LINESTRING = "LineString", he.TYPENAME_LINEARRING = "LinearRing", he.TYPENAME_MULTILINESTRING = "MultiLineString", he.TYPENAME_POLYGON = "Polygon", he.TYPENAME_MULTIPOLYGON = "MultiPolygon", he.TYPENAME_GEOMETRYCOLLECTION = "GeometryCollection", he.geometryChangedFilter = { get interfaces_() {
        return [j];
      }, filter: function(o) {
        o.geometryChangedAction();
      } };
      var C = function() {
        function o() {
          u(this, o);
        }
        return h(o, null, [{ key: "toLocationSymbol", value: function(t) {
          switch (t) {
            case o.EXTERIOR:
              return "e";
            case o.BOUNDARY:
              return "b";
            case o.INTERIOR:
              return "i";
            case o.NONE:
              return "-";
          }
          throw new X("Unknown location value: " + t);
        } }]);
      }();
      C.INTERIOR = 0, C.BOUNDARY = 1, C.EXTERIOR = 2, C.NONE = -1;
      var Pe = function() {
        return h(function o() {
          u(this, o);
        }, [{ key: "add", value: function() {
        } }, { key: "addAll", value: function() {
        } }, { key: "isEmpty", value: function() {
        } }, { key: "iterator", value: function() {
        } }, { key: "size", value: function() {
        } }, { key: "toArray", value: function() {
        } }, { key: "remove", value: function() {
        } }]);
      }(), Oe = function(o) {
        function t(i) {
          var a;
          return u(this, t), (a = s(this, t, [i])).name = Object.keys({ NoSuchElementException: t })[0], a;
        }
        return _(t, o), h(t);
      }(V), Se = function(o) {
        function t(i) {
          var a;
          return u(this, t), (a = s(this, t, [i])).name = Object.keys({ UnsupportedOperationException: t })[0], a;
        }
        return _(t, o), h(t);
      }(V), Rr = function(o) {
        function t() {
          return u(this, t), s(this, t, arguments);
        }
        return _(t, o), h(t, [{ key: "contains", value: function() {
        } }]);
      }(Pe), pn = function(o) {
        function t(i) {
          var a;
          return u(this, t), (a = s(this, t)).map = /* @__PURE__ */ new Map(), i instanceof Pe && a.addAll(i), a;
        }
        return _(t, o), h(t, [{ key: "contains", value: function(i) {
          var a = i.hashCode ? i.hashCode() : i;
          return !!this.map.has(a);
        } }, { key: "add", value: function(i) {
          var a = i.hashCode ? i.hashCode() : i;
          return !this.map.has(a) && !!this.map.set(a, i);
        } }, { key: "addAll", value: function(i) {
          var a, l = m(i);
          try {
            for (l.s(); !(a = l.n()).done; ) {
              var g = a.value;
              this.add(g);
            }
          } catch (p) {
            l.e(p);
          } finally {
            l.f();
          }
          return !0;
        } }, { key: "remove", value: function() {
          throw new Se();
        } }, { key: "size", value: function() {
          return this.map.size;
        } }, { key: "isEmpty", value: function() {
          return this.map.size === 0;
        } }, { key: "toArray", value: function() {
          return Array.from(this.map.values());
        } }, { key: "iterator", value: function() {
          return new Dr(this.map);
        } }, { key: Symbol.iterator, value: function() {
          return this.map;
        } }]);
      }(Rr), Dr = function() {
        return h(function o(t) {
          u(this, o), this.iterator = t.values();
          var i = this.iterator.next(), a = i.done, l = i.value;
          this.done = a, this.value = l;
        }, [{ key: "next", value: function() {
          if (this.done) throw new Oe();
          var o = this.value, t = this.iterator.next(), i = t.done, a = t.value;
          return this.done = i, this.value = a, o;
        } }, { key: "hasNext", value: function() {
          return !this.done;
        } }, { key: "remove", value: function() {
          throw new Se();
        } }]);
      }(), ne = function() {
        function o() {
          u(this, o);
        }
        return h(o, null, [{ key: "opposite", value: function(t) {
          return t === o.LEFT ? o.RIGHT : t === o.RIGHT ? o.LEFT : t;
        } }]);
      }();
      ne.ON = 0, ne.LEFT = 1, ne.RIGHT = 2;
      var Ii = function(o) {
        function t(i) {
          var a;
          return u(this, t), (a = s(this, t, [i])).name = Object.keys({ EmptyStackException: t })[0], a;
        }
        return _(t, o), h(t);
      }(V), bi = function(o) {
        function t(i) {
          var a;
          return u(this, t), (a = s(this, t, [i])).name = Object.keys({ IndexOutOfBoundsException: t })[0], a;
        }
        return _(t, o), h(t);
      }(V), Nn = function(o) {
        function t() {
          return u(this, t), s(this, t, arguments);
        }
        return _(t, o), h(t, [{ key: "get", value: function() {
        } }, { key: "set", value: function() {
        } }, { key: "isEmpty", value: function() {
        } }]);
      }(Pe), Ti = function(o) {
        function t() {
          var i;
          return u(this, t), (i = s(this, t)).array = [], i;
        }
        return _(t, o), h(t, [{ key: "add", value: function(i) {
          return this.array.push(i), !0;
        } }, { key: "get", value: function(i) {
          if (i < 0 || i >= this.size()) throw new bi();
          return this.array[i];
        } }, { key: "push", value: function(i) {
          return this.array.push(i), i;
        } }, { key: "pop", value: function() {
          if (this.array.length === 0) throw new Ii();
          return this.array.pop();
        } }, { key: "peek", value: function() {
          if (this.array.length === 0) throw new Ii();
          return this.array[this.array.length - 1];
        } }, { key: "empty", value: function() {
          return this.array.length === 0;
        } }, { key: "isEmpty", value: function() {
          return this.empty();
        } }, { key: "search", value: function(i) {
          return this.array.indexOf(i);
        } }, { key: "size", value: function() {
          return this.array.length;
        } }, { key: "toArray", value: function() {
          return this.array.slice();
        } }]);
      }(Nn);
      function Ee(o, t) {
        return o.interfaces_ && o.interfaces_.indexOf(t) > -1;
      }
      var Dt = function() {
        return h(function o(t) {
          u(this, o), this.str = t;
        }, [{ key: "append", value: function(o) {
          this.str += o;
        } }, { key: "setCharAt", value: function(o, t) {
          this.str = this.str.substr(0, o) + t + this.str.substr(o + 1);
        } }, { key: "toString", value: function() {
          return this.str;
        } }]);
      }(), Qt = function() {
        function o(t) {
          u(this, o), this.value = t;
        }
        return h(o, [{ key: "intValue", value: function() {
          return this.value;
        } }, { key: "compareTo", value: function(t) {
          return this.value < t ? -1 : this.value > t ? 1 : 0;
        } }], [{ key: "compare", value: function(t, i) {
          return t < i ? -1 : t > i ? 1 : 0;
        } }, { key: "isNan", value: function(t) {
          return Number.isNaN(t);
        } }, { key: "valueOf", value: function(t) {
          return new o(t);
        } }]);
      }(), Fr = function() {
        return h(function o() {
          u(this, o);
        }, null, [{ key: "isWhitespace", value: function(o) {
          return o <= 32 && o >= 0 || o === 127;
        } }, { key: "toUpperCase", value: function(o) {
          return o.toUpperCase();
        } }]);
      }(), ye = function() {
        function o() {
          u(this, o), o.constructor_.apply(this, arguments);
        }
        return h(o, [{ key: "le", value: function(t) {
          return this._hi < t._hi || this._hi === t._hi && this._lo <= t._lo;
        } }, { key: "extractSignificantDigits", value: function(t, i) {
          var a = this.abs(), l = o.magnitude(a._hi), g = o.TEN.pow(l);
          (a = a.divide(g)).gt(o.TEN) ? (a = a.divide(o.TEN), l += 1) : a.lt(o.ONE) && (a = a.multiply(o.TEN), l -= 1);
          for (var p = l + 1, v = new Dt(), w = o.MAX_PRINT_DIGITS - 1, b = 0; b <= w; b++) {
            t && b === p && v.append(".");
            var z = Math.trunc(a._hi);
            if (z < 0) break;
            var W = !1, Q = 0;
            z > 9 ? (W = !0, Q = "9") : Q = "0" + z, v.append(Q), a = a.subtract(o.valueOf(z)).multiply(o.TEN), W && a.selfAdd(o.TEN);
            var le = !0, fe = o.magnitude(a._hi);
            if (fe < 0 && Math.abs(fe) >= w - b && (le = !1), !le) break;
          }
          return i[0] = l, v.toString();
        } }, { key: "sqr", value: function() {
          return this.multiply(this);
        } }, { key: "doubleValue", value: function() {
          return this._hi + this._lo;
        } }, { key: "subtract", value: function() {
          if (arguments[0] instanceof o) {
            var t = arguments[0];
            return this.add(t.negate());
          }
          if (typeof arguments[0] == "number") {
            var i = arguments[0];
            return this.add(-i);
          }
        } }, { key: "equals", value: function() {
          if (arguments.length === 1 && arguments[0] instanceof o) {
            var t = arguments[0];
            return this._hi === t._hi && this._lo === t._lo;
          }
        } }, { key: "isZero", value: function() {
          return this._hi === 0 && this._lo === 0;
        } }, { key: "selfSubtract", value: function() {
          if (arguments[0] instanceof o) {
            var t = arguments[0];
            return this.isNaN() ? this : this.selfAdd(-t._hi, -t._lo);
          }
          if (typeof arguments[0] == "number") {
            var i = arguments[0];
            return this.isNaN() ? this : this.selfAdd(-i, 0);
          }
        } }, { key: "getSpecialNumberString", value: function() {
          return this.isZero() ? "0.0" : this.isNaN() ? "NaN " : null;
        } }, { key: "min", value: function(t) {
          return this.le(t) ? this : t;
        } }, { key: "selfDivide", value: function() {
          if (arguments.length === 1) {
            if (arguments[0] instanceof o) {
              var t = arguments[0];
              return this.selfDivide(t._hi, t._lo);
            }
            if (typeof arguments[0] == "number") {
              var i = arguments[0];
              return this.selfDivide(i, 0);
            }
          } else if (arguments.length === 2) {
            var a, l, g, p, v = arguments[0], w = arguments[1], b = null, z = null, W = null, Q = null;
            return g = this._hi / v, Q = (b = (W = o.SPLIT * g) - (b = W - g)) * (z = (Q = o.SPLIT * v) - (z = Q - v)) - (p = g * v) + b * (l = v - z) + (a = g - b) * z + a * l, Q = g + (W = (this._hi - p - Q + this._lo - g * w) / v), this._hi = Q, this._lo = g - Q + W, this;
          }
        } }, { key: "dump", value: function() {
          return "DD<" + this._hi + ", " + this._lo + ">";
        } }, { key: "divide", value: function() {
          if (arguments[0] instanceof o) {
            var t, i, a, l, g = arguments[0], p = null, v = null, w = null, b = null;
            return t = (a = this._hi / g._hi) - (p = (w = o.SPLIT * a) - (p = w - a)), b = p * (v = (b = o.SPLIT * g._hi) - (v = b - g._hi)) - (l = a * g._hi) + p * (i = g._hi - v) + t * v + t * i, new o(b = a + (w = (this._hi - l - b + this._lo - a * g._lo) / g._hi), a - b + w);
          }
          if (typeof arguments[0] == "number") {
            var z = arguments[0];
            return K.isNaN(z) ? o.createNaN() : o.copy(this).selfDivide(z, 0);
          }
        } }, { key: "ge", value: function(t) {
          return this._hi > t._hi || this._hi === t._hi && this._lo >= t._lo;
        } }, { key: "pow", value: function(t) {
          if (t === 0) return o.valueOf(1);
          var i = new o(this), a = o.valueOf(1), l = Math.abs(t);
          if (l > 1) for (; l > 0; ) l % 2 == 1 && a.selfMultiply(i), (l /= 2) > 0 && (i = i.sqr());
          else a = i;
          return t < 0 ? a.reciprocal() : a;
        } }, { key: "ceil", value: function() {
          if (this.isNaN()) return o.NaN;
          var t = Math.ceil(this._hi), i = 0;
          return t === this._hi && (i = Math.ceil(this._lo)), new o(t, i);
        } }, { key: "compareTo", value: function(t) {
          var i = t;
          return this._hi < i._hi ? -1 : this._hi > i._hi ? 1 : this._lo < i._lo ? -1 : this._lo > i._lo ? 1 : 0;
        } }, { key: "rint", value: function() {
          return this.isNaN() ? this : this.add(0.5).floor();
        } }, { key: "setValue", value: function() {
          if (arguments[0] instanceof o) {
            var t = arguments[0];
            return this.init(t), this;
          }
          if (typeof arguments[0] == "number") {
            var i = arguments[0];
            return this.init(i), this;
          }
        } }, { key: "max", value: function(t) {
          return this.ge(t) ? this : t;
        } }, { key: "sqrt", value: function() {
          if (this.isZero()) return o.valueOf(0);
          if (this.isNegative()) return o.NaN;
          var t = 1 / Math.sqrt(this._hi), i = this._hi * t, a = o.valueOf(i), l = this.subtract(a.sqr())._hi * (0.5 * t);
          return a.add(l);
        } }, { key: "selfAdd", value: function() {
          if (arguments.length === 1) {
            if (arguments[0] instanceof o) {
              var t = arguments[0];
              return this.selfAdd(t._hi, t._lo);
            }
            if (typeof arguments[0] == "number") {
              var i, a, l, g, p, v = arguments[0], w = null;
              return w = (l = this._hi + v) - (g = l - this._hi), a = (p = (w = v - g + (this._hi - w)) + this._lo) + (l - (i = l + p)), this._hi = i + a, this._lo = a + (i - this._hi), this;
            }
          } else if (arguments.length === 2) {
            var b, z, W, Q, le = arguments[0], fe = arguments[1], ve = null, Te = null, Ie = null;
            W = this._hi + le, z = this._lo + fe, Te = W - (Ie = W - this._hi), ve = z - (Q = z - this._lo);
            var Fe = (b = W + (Ie = (Te = le - Ie + (this._hi - Te)) + z)) + (Ie = (ve = fe - Q + (this._lo - ve)) + (Ie + (W - b))), ot = Ie + (b - Fe);
            return this._hi = Fe, this._lo = ot, this;
          }
        } }, { key: "selfMultiply", value: function() {
          if (arguments.length === 1) {
            if (arguments[0] instanceof o) {
              var t = arguments[0];
              return this.selfMultiply(t._hi, t._lo);
            }
            if (typeof arguments[0] == "number") {
              var i = arguments[0];
              return this.selfMultiply(i, 0);
            }
          } else if (arguments.length === 2) {
            var a, l, g = arguments[0], p = arguments[1], v = null, w = null, b = null, z = null;
            v = (b = o.SPLIT * this._hi) - this._hi, z = o.SPLIT * g, v = b - v, a = this._hi - v, w = z - g;
            var W = (b = this._hi * g) + (z = v * (w = z - w) - b + v * (l = g - w) + a * w + a * l + (this._hi * p + this._lo * g)), Q = z + (v = b - W);
            return this._hi = W, this._lo = Q, this;
          }
        } }, { key: "selfSqr", value: function() {
          return this.selfMultiply(this);
        } }, { key: "floor", value: function() {
          if (this.isNaN()) return o.NaN;
          var t = Math.floor(this._hi), i = 0;
          return t === this._hi && (i = Math.floor(this._lo)), new o(t, i);
        } }, { key: "negate", value: function() {
          return this.isNaN() ? this : new o(-this._hi, -this._lo);
        } }, { key: "clone", value: function() {
          try {
            return null;
          } catch (t) {
            if (t instanceof CloneNotSupportedException) return null;
            throw t;
          }
        } }, { key: "multiply", value: function() {
          if (arguments[0] instanceof o) {
            var t = arguments[0];
            return t.isNaN() ? o.createNaN() : o.copy(this).selfMultiply(t);
          }
          if (typeof arguments[0] == "number") {
            var i = arguments[0];
            return K.isNaN(i) ? o.createNaN() : o.copy(this).selfMultiply(i, 0);
          }
        } }, { key: "isNaN", value: function() {
          return K.isNaN(this._hi);
        } }, { key: "intValue", value: function() {
          return Math.trunc(this._hi);
        } }, { key: "toString", value: function() {
          var t = o.magnitude(this._hi);
          return t >= -3 && t <= 20 ? this.toStandardNotation() : this.toSciNotation();
        } }, { key: "toStandardNotation", value: function() {
          var t = this.getSpecialNumberString();
          if (t !== null) return t;
          var i = new Array(1).fill(null), a = this.extractSignificantDigits(!0, i), l = i[0] + 1, g = a;
          if (a.charAt(0) === ".") g = "0" + a;
          else if (l < 0) g = "0." + o.stringOfChar("0", -l) + a;
          else if (a.indexOf(".") === -1) {
            var p = l - a.length;
            g = a + o.stringOfChar("0", p) + ".0";
          }
          return this.isNegative() ? "-" + g : g;
        } }, { key: "reciprocal", value: function() {
          var t, i, a, l, g = null, p = null, v = null, w = null;
          t = (a = 1 / this._hi) - (g = (v = o.SPLIT * a) - (g = v - a)), p = (w = o.SPLIT * this._hi) - this._hi;
          var b = a + (v = (1 - (l = a * this._hi) - (w = g * (p = w - p) - l + g * (i = this._hi - p) + t * p + t * i) - a * this._lo) / this._hi);
          return new o(b, a - b + v);
        } }, { key: "toSciNotation", value: function() {
          if (this.isZero()) return o.SCI_NOT_ZERO;
          var t = this.getSpecialNumberString();
          if (t !== null) return t;
          var i = new Array(1).fill(null), a = this.extractSignificantDigits(!1, i), l = o.SCI_NOT_EXPONENT_CHAR + i[0];
          if (a.charAt(0) === "0") throw new IllegalStateException("Found leading zero: " + a);
          var g = "";
          a.length > 1 && (g = a.substring(1));
          var p = a.charAt(0) + "." + g;
          return this.isNegative() ? "-" + p + l : p + l;
        } }, { key: "abs", value: function() {
          return this.isNaN() ? o.NaN : this.isNegative() ? this.negate() : new o(this);
        } }, { key: "isPositive", value: function() {
          return this._hi > 0 || this._hi === 0 && this._lo > 0;
        } }, { key: "lt", value: function(t) {
          return this._hi < t._hi || this._hi === t._hi && this._lo < t._lo;
        } }, { key: "add", value: function() {
          if (arguments[0] instanceof o) {
            var t = arguments[0];
            return o.copy(this).selfAdd(t);
          }
          if (typeof arguments[0] == "number") {
            var i = arguments[0];
            return o.copy(this).selfAdd(i);
          }
        } }, { key: "init", value: function() {
          if (arguments.length === 1) {
            if (typeof arguments[0] == "number") {
              var t = arguments[0];
              this._hi = t, this._lo = 0;
            } else if (arguments[0] instanceof o) {
              var i = arguments[0];
              this._hi = i._hi, this._lo = i._lo;
            }
          } else if (arguments.length === 2) {
            var a = arguments[0], l = arguments[1];
            this._hi = a, this._lo = l;
          }
        } }, { key: "gt", value: function(t) {
          return this._hi > t._hi || this._hi === t._hi && this._lo > t._lo;
        } }, { key: "isNegative", value: function() {
          return this._hi < 0 || this._hi === 0 && this._lo < 0;
        } }, { key: "trunc", value: function() {
          return this.isNaN() ? o.NaN : this.isPositive() ? this.floor() : this.ceil();
        } }, { key: "signum", value: function() {
          return this._hi > 0 ? 1 : this._hi < 0 ? -1 : this._lo > 0 ? 1 : this._lo < 0 ? -1 : 0;
        } }, { key: "interfaces_", get: function() {
          return [k, $, x];
        } }], [{ key: "constructor_", value: function() {
          if (this._hi = 0, this._lo = 0, arguments.length === 0) this.init(0);
          else if (arguments.length === 1) {
            if (typeof arguments[0] == "number") {
              var t = arguments[0];
              this.init(t);
            } else if (arguments[0] instanceof o) {
              var i = arguments[0];
              this.init(i);
            } else if (typeof arguments[0] == "string") {
              var a = arguments[0];
              o.constructor_.call(this, o.parse(a));
            }
          } else if (arguments.length === 2) {
            var l = arguments[0], g = arguments[1];
            this.init(l, g);
          }
        } }, { key: "determinant", value: function() {
          if (typeof arguments[3] == "number" && typeof arguments[2] == "number" && typeof arguments[0] == "number" && typeof arguments[1] == "number") {
            var t = arguments[0], i = arguments[1], a = arguments[2], l = arguments[3];
            return o.determinant(o.valueOf(t), o.valueOf(i), o.valueOf(a), o.valueOf(l));
          }
          if (arguments[3] instanceof o && arguments[2] instanceof o && arguments[0] instanceof o && arguments[1] instanceof o) {
            var g = arguments[1], p = arguments[2], v = arguments[3];
            return arguments[0].multiply(v).selfSubtract(g.multiply(p));
          }
        } }, { key: "sqr", value: function(t) {
          return o.valueOf(t).selfMultiply(t);
        } }, { key: "valueOf", value: function() {
          if (typeof arguments[0] == "string") {
            var t = arguments[0];
            return o.parse(t);
          }
          if (typeof arguments[0] == "number") return new o(arguments[0]);
        } }, { key: "sqrt", value: function(t) {
          return o.valueOf(t).sqrt();
        } }, { key: "parse", value: function(t) {
          for (var i = 0, a = t.length; Fr.isWhitespace(t.charAt(i)); ) i++;
          var l = !1;
          if (i < a) {
            var g = t.charAt(i);
            g !== "-" && g !== "+" || (i++, g === "-" && (l = !0));
          }
          for (var p = new o(), v = 0, w = 0, b = 0, z = !1; !(i >= a); ) {
            var W = t.charAt(i);
            if (i++, Fr.isDigit(W)) {
              var Q = W - "0";
              p.selfMultiply(o.TEN), p.selfAdd(Q), v++;
            } else {
              if (W !== ".") {
                if (W === "e" || W === "E") {
                  var le = t.substring(i);
                  try {
                    b = Qt.parseInt(le);
                  } catch (Fe) {
                    throw Fe instanceof NumberFormatException ? new NumberFormatException("Invalid exponent " + le + " in string " + t) : Fe;
                  }
                  break;
                }
                throw new NumberFormatException("Unexpected character '" + W + "' at position " + i + " in string " + t);
              }
              w = v, z = !0;
            }
          }
          var fe = p;
          z || (w = v);
          var ve = v - w - b;
          if (ve === 0) fe = p;
          else if (ve > 0) {
            var Te = o.TEN.pow(ve);
            fe = p.divide(Te);
          } else if (ve < 0) {
            var Ie = o.TEN.pow(-ve);
            fe = p.multiply(Ie);
          }
          return l ? fe.negate() : fe;
        } }, { key: "createNaN", value: function() {
          return new o(K.NaN, K.NaN);
        } }, { key: "copy", value: function(t) {
          return new o(t);
        } }, { key: "magnitude", value: function(t) {
          var i = Math.abs(t), a = Math.log(i) / Math.log(10), l = Math.trunc(Math.floor(a));
          return 10 * Math.pow(10, l) <= i && (l += 1), l;
        } }, { key: "stringOfChar", value: function(t, i) {
          for (var a = new Dt(), l = 0; l < i; l++) a.append(t);
          return a.toString();
        } }]);
      }();
      ye.PI = new ye(3.141592653589793, 12246467991473532e-32), ye.TWO_PI = new ye(6.283185307179586, 24492935982947064e-32), ye.PI_2 = new ye(1.5707963267948966, 6123233995736766e-32), ye.E = new ye(2.718281828459045, 14456468917292502e-32), ye.NaN = new ye(K.NaN, K.NaN), ye.EPS = 123259516440783e-46, ye.SPLIT = 134217729, ye.MAX_PRINT_DIGITS = 32, ye.TEN = ye.valueOf(10), ye.ONE = ye.valueOf(1), ye.SCI_NOT_EXPONENT_CHAR = "E", ye.SCI_NOT_ZERO = "0.0E0";
      var Gr = function() {
        function o() {
          u(this, o);
        }
        return h(o, null, [{ key: "orientationIndex", value: function(t, i, a) {
          var l = o.orientationIndexFilter(t, i, a);
          if (l <= 1) return l;
          var g = ye.valueOf(i.x).selfAdd(-t.x), p = ye.valueOf(i.y).selfAdd(-t.y), v = ye.valueOf(a.x).selfAdd(-i.x), w = ye.valueOf(a.y).selfAdd(-i.y);
          return g.selfMultiply(w).selfSubtract(p.selfMultiply(v)).signum();
        } }, { key: "signOfDet2x2", value: function() {
          if (arguments[3] instanceof ye && arguments[2] instanceof ye && arguments[0] instanceof ye && arguments[1] instanceof ye) {
            var t = arguments[1], i = arguments[2], a = arguments[3];
            return arguments[0].multiply(a).selfSubtract(t.multiply(i)).signum();
          }
          if (typeof arguments[3] == "number" && typeof arguments[2] == "number" && typeof arguments[0] == "number" && typeof arguments[1] == "number") {
            var l = arguments[0], g = arguments[1], p = arguments[2], v = arguments[3], w = ye.valueOf(l), b = ye.valueOf(g), z = ye.valueOf(p), W = ye.valueOf(v);
            return w.multiply(W).selfSubtract(b.multiply(z)).signum();
          }
        } }, { key: "intersection", value: function(t, i, a, l) {
          var g = new ye(t.y).selfSubtract(i.y), p = new ye(i.x).selfSubtract(t.x), v = new ye(t.x).selfMultiply(i.y).selfSubtract(new ye(i.x).selfMultiply(t.y)), w = new ye(a.y).selfSubtract(l.y), b = new ye(l.x).selfSubtract(a.x), z = new ye(a.x).selfMultiply(l.y).selfSubtract(new ye(l.x).selfMultiply(a.y)), W = p.multiply(z).selfSubtract(b.multiply(v)), Q = w.multiply(v).selfSubtract(g.multiply(z)), le = g.multiply(b).selfSubtract(w.multiply(p)), fe = W.selfDivide(le).doubleValue(), ve = Q.selfDivide(le).doubleValue();
          return K.isNaN(fe) || K.isInfinite(fe) || K.isNaN(ve) || K.isInfinite(ve) ? null : new J(fe, ve);
        } }, { key: "orientationIndexFilter", value: function(t, i, a) {
          var l = null, g = (t.x - a.x) * (i.y - a.y), p = (t.y - a.y) * (i.x - a.x), v = g - p;
          if (g > 0) {
            if (p <= 0) return o.signum(v);
            l = g + p;
          } else {
            if (!(g < 0) || p >= 0) return o.signum(v);
            l = -g - p;
          }
          var w = o.DP_SAFE_EPSILON * l;
          return v >= w || -v >= w ? o.signum(v) : 2;
        } }, { key: "signum", value: function(t) {
          return t > 0 ? 1 : t < 0 ? -1 : 0;
        } }]);
      }();
      Gr.DP_SAFE_EPSILON = 1e-15;
      var ke = function() {
        return h(function o() {
          u(this, o);
        }, [{ key: "getM", value: function(o) {
          if (this.hasM()) {
            var t = this.getDimension() - this.getMeasures();
            return this.getOrdinate(o, t);
          }
          return K.NaN;
        } }, { key: "setOrdinate", value: function(o, t, i) {
        } }, { key: "getZ", value: function(o) {
          return this.hasZ() ? this.getOrdinate(o, 2) : K.NaN;
        } }, { key: "size", value: function() {
        } }, { key: "getOrdinate", value: function(o, t) {
        } }, { key: "getCoordinate", value: function() {
        } }, { key: "getCoordinateCopy", value: function(o) {
        } }, { key: "createCoordinate", value: function() {
        } }, { key: "getDimension", value: function() {
        } }, { key: "hasM", value: function() {
          return this.getMeasures() > 0;
        } }, { key: "getX", value: function(o) {
        } }, { key: "hasZ", value: function() {
          return this.getDimension() - this.getMeasures() > 2;
        } }, { key: "getMeasures", value: function() {
          return 0;
        } }, { key: "expandEnvelope", value: function(o) {
        } }, { key: "copy", value: function() {
        } }, { key: "getY", value: function(o) {
        } }, { key: "toCoordinateArray", value: function() {
        } }, { key: "interfaces_", get: function() {
          return [x];
        } }]);
      }();
      ke.X = 0, ke.Y = 1, ke.Z = 2, ke.M = 3;
      var _e = function() {
        function o() {
          u(this, o);
        }
        return h(o, null, [{ key: "index", value: function(t, i, a) {
          return Gr.orientationIndex(t, i, a);
        } }, { key: "isCCW", value: function() {
          if (arguments[0] instanceof Array) {
            var t = arguments[0], i = t.length - 1;
            if (i < 3) throw new X("Ring has fewer than 4 points, so orientation cannot be determined");
            for (var a = t[0], l = 0, g = 1; g <= i; g++) {
              var p = t[g];
              p.y > a.y && (a = p, l = g);
            }
            var v = l;
            do
              (v -= 1) < 0 && (v = i);
            while (t[v].equals2D(a) && v !== l);
            var w = l;
            do
              w = (w + 1) % i;
            while (t[w].equals2D(a) && w !== l);
            var b = t[v], z = t[w];
            if (b.equals2D(a) || z.equals2D(a) || b.equals2D(z)) return !1;
            var W = o.index(b, a, z);
            return W === 0 ? b.x > z.x : W > 0;
          }
          if (Ee(arguments[0], ke)) {
            var Q = arguments[0], le = Q.size() - 1;
            if (le < 3) throw new X("Ring has fewer than 4 points, so orientation cannot be determined");
            for (var fe = Q.getCoordinate(0), ve = 0, Te = 1; Te <= le; Te++) {
              var Ie = Q.getCoordinate(Te);
              Ie.y > fe.y && (fe = Ie, ve = Te);
            }
            var Fe = null, ot = ve;
            do
              (ot -= 1) < 0 && (ot = le), Fe = Q.getCoordinate(ot);
            while (Fe.equals2D(fe) && ot !== ve);
            var ct = null, Er = ve;
            do
              Er = (Er + 1) % le, ct = Q.getCoordinate(Er);
            while (ct.equals2D(fe) && Er !== ve);
            if (Fe.equals2D(fe) || ct.equals2D(fe) || Fe.equals2D(ct)) return !1;
            var Ui = o.index(Fe, fe, ct);
            return Ui === 0 ? Fe.x > ct.x : Ui > 0;
          }
        } }]);
      }();
      _e.CLOCKWISE = -1, _e.RIGHT = _e.CLOCKWISE, _e.COUNTERCLOCKWISE = 1, _e.LEFT = _e.COUNTERCLOCKWISE, _e.COLLINEAR = 0, _e.STRAIGHT = _e.COLLINEAR;
      var Br = function() {
        return h(function o() {
          u(this, o), o.constructor_.apply(this, arguments);
        }, [{ key: "getCoordinate", value: function() {
          return this._minCoord;
        } }, { key: "getRightmostSide", value: function(o, t) {
          var i = this.getRightmostSideOfSegment(o, t);
          return i < 0 && (i = this.getRightmostSideOfSegment(o, t - 1)), i < 0 && (this._minCoord = null, this.checkForRightmostCoordinate(o)), i;
        } }, { key: "findRightmostEdgeAtVertex", value: function() {
          var o = this._minDe.getEdge().getCoordinates();
          se.isTrue(this._minIndex > 0 && this._minIndex < o.length, "rightmost point expected to be interior vertex of edge");
          var t = o[this._minIndex - 1], i = o[this._minIndex + 1], a = _e.index(this._minCoord, i, t), l = !1;
          (t.y < this._minCoord.y && i.y < this._minCoord.y && a === _e.COUNTERCLOCKWISE || t.y > this._minCoord.y && i.y > this._minCoord.y && a === _e.CLOCKWISE) && (l = !0), l && (this._minIndex = this._minIndex - 1);
        } }, { key: "getRightmostSideOfSegment", value: function(o, t) {
          var i = o.getEdge().getCoordinates();
          if (t < 0 || t + 1 >= i.length || i[t].y === i[t + 1].y) return -1;
          var a = ne.LEFT;
          return i[t].y < i[t + 1].y && (a = ne.RIGHT), a;
        } }, { key: "getEdge", value: function() {
          return this._orientedDe;
        } }, { key: "checkForRightmostCoordinate", value: function(o) {
          for (var t = o.getEdge().getCoordinates(), i = 0; i < t.length - 1; i++) (this._minCoord === null || t[i].x > this._minCoord.x) && (this._minDe = o, this._minIndex = i, this._minCoord = t[i]);
        } }, { key: "findRightmostEdgeAtNode", value: function() {
          var o = this._minDe.getNode().getEdges();
          this._minDe = o.getRightmostEdge(), this._minDe.isForward() || (this._minDe = this._minDe.getSym(), this._minIndex = this._minDe.getEdge().getCoordinates().length - 1);
        } }, { key: "findEdge", value: function(o) {
          for (var t = o.iterator(); t.hasNext(); ) {
            var i = t.next();
            i.isForward() && this.checkForRightmostCoordinate(i);
          }
          se.isTrue(this._minIndex !== 0 || this._minCoord.equals(this._minDe.getCoordinate()), "inconsistency in rightmost processing"), this._minIndex === 0 ? this.findRightmostEdgeAtNode() : this.findRightmostEdgeAtVertex(), this._orientedDe = this._minDe, this.getRightmostSide(this._minDe, this._minIndex) === ne.LEFT && (this._orientedDe = this._minDe.getSym());
        } }], [{ key: "constructor_", value: function() {
          this._minIndex = -1, this._minCoord = null, this._minDe = null, this._orientedDe = null;
        } }]);
      }(), xt = function(o) {
        function t(i, a) {
          var l;
          return u(this, t), (l = s(this, t, [a ? i + " [ " + a + " ]" : i])).pt = a ? new J(a) : void 0, l.name = Object.keys({ TopologyException: t })[0], l;
        }
        return _(t, o), h(t, [{ key: "getCoordinate", value: function() {
          return this.pt;
        } }]);
      }(de), en = function() {
        return h(function o() {
          u(this, o), this.array = [];
        }, [{ key: "addLast", value: function(o) {
          this.array.push(o);
        } }, { key: "removeFirst", value: function() {
          return this.array.shift();
        } }, { key: "isEmpty", value: function() {
          return this.array.length === 0;
        } }]);
      }(), me = function(o) {
        function t(i) {
          var a;
          return u(this, t), (a = s(this, t)).array = [], i instanceof Pe && a.addAll(i), a;
        }
        return _(t, o), h(t, [{ key: "interfaces_", get: function() {
          return [Nn, Pe];
        } }, { key: "ensureCapacity", value: function() {
        } }, { key: "add", value: function(i) {
          return arguments.length === 1 ? this.array.push(i) : this.array.splice(arguments[0], 0, arguments[1]), !0;
        } }, { key: "clear", value: function() {
          this.array = [];
        } }, { key: "addAll", value: function(i) {
          var a, l = m(i);
          try {
            for (l.s(); !(a = l.n()).done; ) {
              var g = a.value;
              this.array.push(g);
            }
          } catch (p) {
            l.e(p);
          } finally {
            l.f();
          }
        } }, { key: "set", value: function(i, a) {
          var l = this.array[i];
          return this.array[i] = a, l;
        } }, { key: "iterator", value: function() {
          return new Li(this);
        } }, { key: "get", value: function(i) {
          if (i < 0 || i >= this.size()) throw new bi();
          return this.array[i];
        } }, { key: "isEmpty", value: function() {
          return this.array.length === 0;
        } }, { key: "sort", value: function(i) {
          i ? this.array.sort(function(a, l) {
            return i.compare(a, l);
          }) : this.array.sort();
        } }, { key: "size", value: function() {
          return this.array.length;
        } }, { key: "toArray", value: function() {
          return this.array.slice();
        } }, { key: "remove", value: function(i) {
          for (var a = 0, l = this.array.length; a < l; a++) if (this.array[a] === i) return !!this.array.splice(a, 1);
          return !1;
        } }, { key: Symbol.iterator, value: function() {
          return this.array.values();
        } }]);
      }(Nn), Li = function() {
        return h(function o(t) {
          u(this, o), this.arrayList = t, this.position = 0;
        }, [{ key: "next", value: function() {
          if (this.position === this.arrayList.size()) throw new Oe();
          return this.arrayList.get(this.position++);
        } }, { key: "hasNext", value: function() {
          return this.position < this.arrayList.size();
        } }, { key: "set", value: function(o) {
          return this.arrayList.set(this.position - 1, o);
        } }, { key: "remove", value: function() {
          this.arrayList.remove(this.arrayList.get(this.position));
        } }]);
      }(), Ci = function() {
        return h(function o() {
          u(this, o), o.constructor_.apply(this, arguments);
        }, [{ key: "clearVisitedEdges", value: function() {
          for (var o = this._dirEdgeList.iterator(); o.hasNext(); )
            o.next().setVisited(!1);
        } }, { key: "getRightmostCoordinate", value: function() {
          return this._rightMostCoord;
        } }, { key: "computeNodeDepth", value: function(o) {
          for (var t = null, i = o.getEdges().iterator(); i.hasNext(); ) {
            var a = i.next();
            if (a.isVisited() || a.getSym().isVisited()) {
              t = a;
              break;
            }
          }
          if (t === null) throw new xt("unable to find edge to compute depths at " + o.getCoordinate());
          o.getEdges().computeDepths(t);
          for (var l = o.getEdges().iterator(); l.hasNext(); ) {
            var g = l.next();
            g.setVisited(!0), this.copySymDepths(g);
          }
        } }, { key: "computeDepth", value: function(o) {
          this.clearVisitedEdges();
          var t = this._finder.getEdge();
          t.getNode(), t.getLabel(), t.setEdgeDepths(ne.RIGHT, o), this.copySymDepths(t), this.computeDepths(t);
        } }, { key: "create", value: function(o) {
          this.addReachable(o), this._finder.findEdge(this._dirEdgeList), this._rightMostCoord = this._finder.getCoordinate();
        } }, { key: "findResultEdges", value: function() {
          for (var o = this._dirEdgeList.iterator(); o.hasNext(); ) {
            var t = o.next();
            t.getDepth(ne.RIGHT) >= 1 && t.getDepth(ne.LEFT) <= 0 && !t.isInteriorAreaEdge() && t.setInResult(!0);
          }
        } }, { key: "computeDepths", value: function(o) {
          var t = new pn(), i = new en(), a = o.getNode();
          for (i.addLast(a), t.add(a), o.setVisited(!0); !i.isEmpty(); ) {
            var l = i.removeFirst();
            t.add(l), this.computeNodeDepth(l);
            for (var g = l.getEdges().iterator(); g.hasNext(); ) {
              var p = g.next().getSym();
              if (!p.isVisited()) {
                var v = p.getNode();
                t.contains(v) || (i.addLast(v), t.add(v));
              }
            }
          }
        } }, { key: "compareTo", value: function(o) {
          var t = o;
          return this._rightMostCoord.x < t._rightMostCoord.x ? -1 : this._rightMostCoord.x > t._rightMostCoord.x ? 1 : 0;
        } }, { key: "getEnvelope", value: function() {
          if (this._env === null) {
            for (var o = new be(), t = this._dirEdgeList.iterator(); t.hasNext(); ) for (var i = t.next().getEdge().getCoordinates(), a = 0; a < i.length - 1; a++) o.expandToInclude(i[a]);
            this._env = o;
          }
          return this._env;
        } }, { key: "addReachable", value: function(o) {
          var t = new Ti();
          for (t.add(o); !t.empty(); ) {
            var i = t.pop();
            this.add(i, t);
          }
        } }, { key: "copySymDepths", value: function(o) {
          var t = o.getSym();
          t.setDepth(ne.LEFT, o.getDepth(ne.RIGHT)), t.setDepth(ne.RIGHT, o.getDepth(ne.LEFT));
        } }, { key: "add", value: function(o, t) {
          o.setVisited(!0), this._nodes.add(o);
          for (var i = o.getEdges().iterator(); i.hasNext(); ) {
            var a = i.next();
            this._dirEdgeList.add(a);
            var l = a.getSym().getNode();
            l.isVisited() || t.push(l);
          }
        } }, { key: "getNodes", value: function() {
          return this._nodes;
        } }, { key: "getDirectedEdges", value: function() {
          return this._dirEdgeList;
        } }, { key: "interfaces_", get: function() {
          return [$];
        } }], [{ key: "constructor_", value: function() {
          this._finder = null, this._dirEdgeList = new me(), this._nodes = new me(), this._rightMostCoord = null, this._env = null, this._finder = new Br();
        } }]);
      }(), Ai = function() {
        return h(function o() {
          u(this, o);
        }, null, [{ key: "intersection", value: function(o, t, i, a) {
          var l = o.x < t.x ? o.x : t.x, g = o.y < t.y ? o.y : t.y, p = o.x > t.x ? o.x : t.x, v = o.y > t.y ? o.y : t.y, w = i.x < a.x ? i.x : a.x, b = i.y < a.y ? i.y : a.y, z = i.x > a.x ? i.x : a.x, W = i.y > a.y ? i.y : a.y, Q = ((l > w ? l : w) + (p < z ? p : z)) / 2, le = ((g > b ? g : b) + (v < W ? v : W)) / 2, fe = o.x - Q, ve = o.y - le, Te = t.x - Q, Ie = t.y - le, Fe = i.x - Q, ot = i.y - le, ct = a.x - Q, Er = a.y - le, Ui = ve - Ie, Wl = Te - fe, Zl = fe * Ie - Te * ve, jl = ot - Er, $l = ct - Fe, Kl = Fe * Er - ct * ot, Ql = Ui * $l - jl * Wl, go = (Wl * Kl - $l * Zl) / Ql, po = (jl * Zl - Ui * Kl) / Ql;
          return K.isNaN(go) || K.isInfinite(go) || K.isNaN(po) || K.isInfinite(po) ? null : new J(go + Q, po + le);
        } }]);
      }(), at = function() {
        return h(function o() {
          u(this, o);
        }, null, [{ key: "arraycopy", value: function(o, t, i, a, l) {
          for (var g = 0, p = t; p < t + l; p++) i[a + g] = o[p], g++;
        } }, { key: "getProperty", value: function(o) {
          return { "line.separator": `
` }[o];
        } }]);
      }(), mn = function() {
        function o() {
          u(this, o);
        }
        return h(o, null, [{ key: "log10", value: function(t) {
          var i = Math.log(t);
          return K.isInfinite(i) || K.isNaN(i) ? i : i / o.LOG_10;
        } }, { key: "min", value: function(t, i, a, l) {
          var g = t;
          return i < g && (g = i), a < g && (g = a), l < g && (g = l), g;
        } }, { key: "clamp", value: function() {
          if (typeof arguments[2] == "number" && typeof arguments[0] == "number" && typeof arguments[1] == "number") {
            var t = arguments[0], i = arguments[1], a = arguments[2];
            return t < i ? i : t > a ? a : t;
          }
          if (Number.isInteger(arguments[2]) && Number.isInteger(arguments[0]) && Number.isInteger(arguments[1])) {
            var l = arguments[0], g = arguments[1], p = arguments[2];
            return l < g ? g : l > p ? p : l;
          }
        } }, { key: "wrap", value: function(t, i) {
          return t < 0 ? i - -t % i : t % i;
        } }, { key: "max", value: function() {
          if (arguments.length === 3) {
            var t = arguments[1], i = arguments[2], a = arguments[0];
            return t > a && (a = t), i > a && (a = i), a;
          }
          if (arguments.length === 4) {
            var l = arguments[1], g = arguments[2], p = arguments[3], v = arguments[0];
            return l > v && (v = l), g > v && (v = g), p > v && (v = p), v;
          }
        } }, { key: "average", value: function(t, i) {
          return (t + i) / 2;
        } }]);
      }();
      mn.LOG_10 = Math.log(10);
      var Ft = function() {
        function o() {
          u(this, o);
        }
        return h(o, null, [{ key: "segmentToSegment", value: function(t, i, a, l) {
          if (t.equals(i)) return o.pointToSegment(t, a, l);
          if (a.equals(l)) return o.pointToSegment(l, t, i);
          var g = !1;
          if (be.intersects(t, i, a, l)) {
            var p = (i.x - t.x) * (l.y - a.y) - (i.y - t.y) * (l.x - a.x);
            if (p === 0) g = !0;
            else {
              var v = (t.y - a.y) * (l.x - a.x) - (t.x - a.x) * (l.y - a.y), w = ((t.y - a.y) * (i.x - t.x) - (t.x - a.x) * (i.y - t.y)) / p, b = v / p;
              (b < 0 || b > 1 || w < 0 || w > 1) && (g = !0);
            }
          } else g = !0;
          return g ? mn.min(o.pointToSegment(t, a, l), o.pointToSegment(i, a, l), o.pointToSegment(a, t, i), o.pointToSegment(l, t, i)) : 0;
        } }, { key: "pointToSegment", value: function(t, i, a) {
          if (i.x === a.x && i.y === a.y) return t.distance(i);
          var l = (a.x - i.x) * (a.x - i.x) + (a.y - i.y) * (a.y - i.y), g = ((t.x - i.x) * (a.x - i.x) + (t.y - i.y) * (a.y - i.y)) / l;
          if (g <= 0) return t.distance(i);
          if (g >= 1) return t.distance(a);
          var p = ((i.y - t.y) * (a.x - i.x) - (i.x - t.x) * (a.y - i.y)) / l;
          return Math.abs(p) * Math.sqrt(l);
        } }, { key: "pointToLinePerpendicular", value: function(t, i, a) {
          var l = (a.x - i.x) * (a.x - i.x) + (a.y - i.y) * (a.y - i.y), g = ((i.y - t.y) * (a.x - i.x) - (i.x - t.x) * (a.y - i.y)) / l;
          return Math.abs(g) * Math.sqrt(l);
        } }, { key: "pointToSegmentString", value: function(t, i) {
          if (i.length === 0) throw new X("Line array must contain at least one vertex");
          for (var a = t.distance(i[0]), l = 0; l < i.length - 1; l++) {
            var g = o.pointToSegment(t, i[l], i[l + 1]);
            g < a && (a = g);
          }
          return a;
        } }]);
      }(), $n = function() {
        return h(function o() {
          u(this, o);
        }, [{ key: "create", value: function() {
          if (arguments.length === 1) arguments[0] instanceof Array || Ee(arguments[0], ke);
          else if (arguments.length !== 2) {
            if (arguments.length === 3) {
              var o = arguments[0], t = arguments[1];
              return this.create(o, t);
            }
          }
        } }]);
      }(), Ur = function() {
        return h(function o() {
          u(this, o);
        }, [{ key: "filter", value: function(o) {
        } }]);
      }(), no = function() {
        return h(function o() {
          u(this, o);
        }, null, [{ key: "ofLine", value: function(o) {
          var t = o.size();
          if (t <= 1) return 0;
          var i = 0, a = new J();
          o.getCoordinate(0, a);
          for (var l = a.x, g = a.y, p = 1; p < t; p++) {
            o.getCoordinate(p, a);
            var v = a.x, w = a.y, b = v - l, z = w - g;
            i += Math.sqrt(b * b + z * z), l = v, g = w;
          }
          return i;
        } }]);
      }(), Ze = h(function o() {
        u(this, o);
      }), wt = function() {
        function o() {
          u(this, o);
        }
        return h(o, null, [{ key: "copyCoord", value: function(t, i, a, l) {
          for (var g = Math.min(t.getDimension(), a.getDimension()), p = 0; p < g; p++) a.setOrdinate(l, p, t.getOrdinate(i, p));
        } }, { key: "isRing", value: function(t) {
          var i = t.size();
          return i === 0 || !(i <= 3) && t.getOrdinate(0, ke.X) === t.getOrdinate(i - 1, ke.X) && t.getOrdinate(0, ke.Y) === t.getOrdinate(i - 1, ke.Y);
        } }, { key: "scroll", value: function() {
          if (arguments.length === 2) {
            if (Ee(arguments[0], ke) && Number.isInteger(arguments[1])) {
              var t = arguments[0], i = arguments[1];
              o.scroll(t, i, o.isRing(t));
            } else if (Ee(arguments[0], ke) && arguments[1] instanceof J) {
              var a = arguments[0], l = arguments[1], g = o.indexOf(l, a);
              if (g <= 0) return null;
              o.scroll(a, g);
            }
          } else if (arguments.length === 3) {
            var p = arguments[0], v = arguments[1], w = arguments[2];
            if (v <= 0) return null;
            for (var b = p.copy(), z = w ? p.size() - 1 : p.size(), W = 0; W < z; W++) for (var Q = 0; Q < p.getDimension(); Q++) p.setOrdinate(W, Q, b.getOrdinate((v + W) % z, Q));
            if (w) for (var le = 0; le < p.getDimension(); le++) p.setOrdinate(z, le, p.getOrdinate(0, le));
          }
        } }, { key: "isEqual", value: function(t, i) {
          var a = t.size();
          if (a !== i.size()) return !1;
          for (var l = Math.min(t.getDimension(), i.getDimension()), g = 0; g < a; g++) for (var p = 0; p < l; p++) {
            var v = t.getOrdinate(g, p), w = i.getOrdinate(g, p);
            if (t.getOrdinate(g, p) !== i.getOrdinate(g, p) && (!K.isNaN(v) || !K.isNaN(w))) return !1;
          }
          return !0;
        } }, { key: "minCoordinateIndex", value: function() {
          if (arguments.length === 1) {
            var t = arguments[0];
            return o.minCoordinateIndex(t, 0, t.size() - 1);
          }
          if (arguments.length === 3) {
            for (var i = arguments[0], a = arguments[2], l = -1, g = null, p = arguments[1]; p <= a; p++) {
              var v = i.getCoordinate(p);
              (g === null || g.compareTo(v) > 0) && (g = v, l = p);
            }
            return l;
          }
        } }, { key: "extend", value: function(t, i, a) {
          var l = t.create(a, i.getDimension()), g = i.size();
          if (o.copy(i, 0, l, 0, g), g > 0) for (var p = g; p < a; p++) o.copy(i, g - 1, l, p, 1);
          return l;
        } }, { key: "reverse", value: function(t) {
          for (var i = t.size() - 1, a = Math.trunc(i / 2), l = 0; l <= a; l++) o.swap(t, l, i - l);
        } }, { key: "swap", value: function(t, i, a) {
          if (i === a) return null;
          for (var l = 0; l < t.getDimension(); l++) {
            var g = t.getOrdinate(i, l);
            t.setOrdinate(i, l, t.getOrdinate(a, l)), t.setOrdinate(a, l, g);
          }
        } }, { key: "copy", value: function(t, i, a, l, g) {
          for (var p = 0; p < g; p++) o.copyCoord(t, i + p, a, l + p);
        } }, { key: "ensureValidRing", value: function(t, i) {
          var a = i.size();
          return a === 0 ? i : a <= 3 ? o.createClosedRing(t, i, 4) : i.getOrdinate(0, ke.X) === i.getOrdinate(a - 1, ke.X) && i.getOrdinate(0, ke.Y) === i.getOrdinate(a - 1, ke.Y) ? i : o.createClosedRing(t, i, a + 1);
        } }, { key: "indexOf", value: function(t, i) {
          for (var a = 0; a < i.size(); a++) if (t.x === i.getOrdinate(a, ke.X) && t.y === i.getOrdinate(a, ke.Y)) return a;
          return -1;
        } }, { key: "createClosedRing", value: function(t, i, a) {
          var l = t.create(a, i.getDimension()), g = i.size();
          o.copy(i, 0, l, 0, g);
          for (var p = g; p < a; p++) o.copy(i, 0, l, p, 1);
          return l;
        } }, { key: "minCoordinate", value: function(t) {
          for (var i = null, a = 0; a < t.size(); a++) {
            var l = t.getCoordinate(a);
            (i === null || i.compareTo(l) > 0) && (i = l);
          }
          return i;
        } }]);
      }(), ie = function() {
        function o() {
          u(this, o);
        }
        return h(o, null, [{ key: "toDimensionSymbol", value: function(t) {
          switch (t) {
            case o.FALSE:
              return o.SYM_FALSE;
            case o.TRUE:
              return o.SYM_TRUE;
            case o.DONTCARE:
              return o.SYM_DONTCARE;
            case o.P:
              return o.SYM_P;
            case o.L:
              return o.SYM_L;
            case o.A:
              return o.SYM_A;
          }
          throw new X("Unknown dimension value: " + t);
        } }, { key: "toDimensionValue", value: function(t) {
          switch (Fr.toUpperCase(t)) {
            case o.SYM_FALSE:
              return o.FALSE;
            case o.SYM_TRUE:
              return o.TRUE;
            case o.SYM_DONTCARE:
              return o.DONTCARE;
            case o.SYM_P:
              return o.P;
            case o.SYM_L:
              return o.L;
            case o.SYM_A:
              return o.A;
          }
          throw new X("Unknown dimension symbol: " + t);
        } }]);
      }();
      ie.P = 0, ie.L = 1, ie.A = 2, ie.FALSE = -1, ie.TRUE = -2, ie.DONTCARE = -3, ie.SYM_FALSE = "F", ie.SYM_TRUE = "T", ie.SYM_DONTCARE = "*", ie.SYM_P = "0", ie.SYM_L = "1", ie.SYM_A = "2";
      var mr = function() {
        return h(function o() {
          u(this, o);
        }, [{ key: "filter", value: function(o) {
        } }]);
      }(), Kn = function() {
        return h(function o() {
          u(this, o);
        }, [{ key: "filter", value: function(o, t) {
        } }, { key: "isDone", value: function() {
        } }, { key: "isGeometryChanged", value: function() {
        } }]);
      }(), Qn = function(o) {
        function t() {
          var i;
          return u(this, t), i = s(this, t), t.constructor_.apply(i, arguments), i;
        }
        return _(t, o), h(t, [{ key: "computeEnvelopeInternal", value: function() {
          return this.isEmpty() ? new be() : this._points.expandEnvelope(new be());
        } }, { key: "isRing", value: function() {
          return this.isClosed() && this.isSimple();
        } }, { key: "getCoordinates", value: function() {
          return this._points.toCoordinateArray();
        } }, { key: "copyInternal", value: function() {
          return new t(this._points.copy(), this._factory);
        } }, { key: "equalsExact", value: function() {
          if (arguments.length === 2 && typeof arguments[1] == "number" && arguments[0] instanceof he) {
            var i = arguments[0], a = arguments[1];
            if (!this.isEquivalentClass(i)) return !1;
            var l = i;
            if (this._points.size() !== l._points.size()) return !1;
            for (var g = 0; g < this._points.size(); g++) if (!this.equal(this._points.getCoordinate(g), l._points.getCoordinate(g), a)) return !1;
            return !0;
          }
          return I(t, "equalsExact", this, 1).apply(this, arguments);
        } }, { key: "normalize", value: function() {
          for (var i = 0; i < Math.trunc(this._points.size() / 2); i++) {
            var a = this._points.size() - 1 - i;
            if (!this._points.getCoordinate(i).equals(this._points.getCoordinate(a))) {
              if (this._points.getCoordinate(i).compareTo(this._points.getCoordinate(a)) > 0) {
                var l = this._points.copy();
                wt.reverse(l), this._points = l;
              }
              return null;
            }
          }
        } }, { key: "getCoordinate", value: function() {
          return this.isEmpty() ? null : this._points.getCoordinate(0);
        } }, { key: "getBoundaryDimension", value: function() {
          return this.isClosed() ? ie.FALSE : 0;
        } }, { key: "isClosed", value: function() {
          return !this.isEmpty() && this.getCoordinateN(0).equals2D(this.getCoordinateN(this.getNumPoints() - 1));
        } }, { key: "reverseInternal", value: function() {
          var i = this._points.copy();
          return wt.reverse(i), this.getFactory().createLineString(i);
        } }, { key: "getEndPoint", value: function() {
          return this.isEmpty() ? null : this.getPointN(this.getNumPoints() - 1);
        } }, { key: "getTypeCode", value: function() {
          return he.TYPECODE_LINESTRING;
        } }, { key: "getDimension", value: function() {
          return 1;
        } }, { key: "getLength", value: function() {
          return no.ofLine(this._points);
        } }, { key: "getNumPoints", value: function() {
          return this._points.size();
        } }, { key: "compareToSameClass", value: function() {
          if (arguments.length === 1) {
            for (var i = arguments[0], a = 0, l = 0; a < this._points.size() && l < i._points.size(); ) {
              var g = this._points.getCoordinate(a).compareTo(i._points.getCoordinate(l));
              if (g !== 0) return g;
              a++, l++;
            }
            return a < this._points.size() ? 1 : l < i._points.size() ? -1 : 0;
          }
          if (arguments.length === 2) {
            var p = arguments[0];
            return arguments[1].compare(this._points, p._points);
          }
        } }, { key: "apply", value: function() {
          if (Ee(arguments[0], Ur)) for (var i = arguments[0], a = 0; a < this._points.size(); a++) i.filter(this._points.getCoordinate(a));
          else if (Ee(arguments[0], Kn)) {
            var l = arguments[0];
            if (this._points.size() === 0) return null;
            for (var g = 0; g < this._points.size() && (l.filter(this._points, g), !l.isDone()); g++) ;
            l.isGeometryChanged() && this.geometryChanged();
          } else Ee(arguments[0], mr) ? arguments[0].filter(this) : Ee(arguments[0], j) && arguments[0].filter(this);
        } }, { key: "getBoundary", value: function() {
          throw new Se();
        } }, { key: "isEquivalentClass", value: function(i) {
          return i instanceof t;
        } }, { key: "getCoordinateN", value: function(i) {
          return this._points.getCoordinate(i);
        } }, { key: "getGeometryType", value: function() {
          return he.TYPENAME_LINESTRING;
        } }, { key: "getCoordinateSequence", value: function() {
          return this._points;
        } }, { key: "isEmpty", value: function() {
          return this._points.size() === 0;
        } }, { key: "init", value: function(i) {
          if (i === null && (i = this.getFactory().getCoordinateSequenceFactory().create([])), i.size() === 1) throw new X("Invalid number of points in LineString (found " + i.size() + " - must be 0 or >= 2)");
          this._points = i;
        } }, { key: "isCoordinate", value: function(i) {
          for (var a = 0; a < this._points.size(); a++) if (this._points.getCoordinate(a).equals(i)) return !0;
          return !1;
        } }, { key: "getStartPoint", value: function() {
          return this.isEmpty() ? null : this.getPointN(0);
        } }, { key: "getPointN", value: function(i) {
          return this.getFactory().createPoint(this._points.getCoordinate(i));
        } }, { key: "interfaces_", get: function() {
          return [Ze];
        } }], [{ key: "constructor_", value: function() {
          if (this._points = null, arguments.length !== 0) {
            if (arguments.length === 2) {
              var i = arguments[0], a = arguments[1];
              he.constructor_.call(this, a), this.init(i);
            }
          }
        } }]);
      }(he), Ni = h(function o() {
        u(this, o);
      }), Oi = function(o) {
        function t() {
          var i;
          return u(this, t), i = s(this, t), t.constructor_.apply(i, arguments), i;
        }
        return _(t, o), h(t, [{ key: "computeEnvelopeInternal", value: function() {
          if (this.isEmpty()) return new be();
          var i = new be();
          return i.expandToInclude(this._coordinates.getX(0), this._coordinates.getY(0)), i;
        } }, { key: "getCoordinates", value: function() {
          return this.isEmpty() ? [] : [this.getCoordinate()];
        } }, { key: "copyInternal", value: function() {
          return new t(this._coordinates.copy(), this._factory);
        } }, { key: "equalsExact", value: function() {
          if (arguments.length === 2 && typeof arguments[1] == "number" && arguments[0] instanceof he) {
            var i = arguments[0], a = arguments[1];
            return !!this.isEquivalentClass(i) && (!(!this.isEmpty() || !i.isEmpty()) || this.isEmpty() === i.isEmpty() && this.equal(i.getCoordinate(), this.getCoordinate(), a));
          }
          return I(t, "equalsExact", this, 1).apply(this, arguments);
        } }, { key: "normalize", value: function() {
        } }, { key: "getCoordinate", value: function() {
          return this._coordinates.size() !== 0 ? this._coordinates.getCoordinate(0) : null;
        } }, { key: "getBoundaryDimension", value: function() {
          return ie.FALSE;
        } }, { key: "reverseInternal", value: function() {
          return this.getFactory().createPoint(this._coordinates.copy());
        } }, { key: "getTypeCode", value: function() {
          return he.TYPECODE_POINT;
        } }, { key: "getDimension", value: function() {
          return 0;
        } }, { key: "getNumPoints", value: function() {
          return this.isEmpty() ? 0 : 1;
        } }, { key: "getX", value: function() {
          if (this.getCoordinate() === null) throw new IllegalStateException("getX called on empty Point");
          return this.getCoordinate().x;
        } }, { key: "compareToSameClass", value: function() {
          if (arguments.length === 1) {
            var i = arguments[0];
            return this.getCoordinate().compareTo(i.getCoordinate());
          }
          if (arguments.length === 2) {
            var a = arguments[0];
            return arguments[1].compare(this._coordinates, a._coordinates);
          }
        } }, { key: "apply", value: function() {
          if (Ee(arguments[0], Ur)) {
            var i = arguments[0];
            if (this.isEmpty()) return null;
            i.filter(this.getCoordinate());
          } else if (Ee(arguments[0], Kn)) {
            var a = arguments[0];
            if (this.isEmpty()) return null;
            a.filter(this._coordinates, 0), a.isGeometryChanged() && this.geometryChanged();
          } else Ee(arguments[0], mr) ? arguments[0].filter(this) : Ee(arguments[0], j) && arguments[0].filter(this);
        } }, { key: "getBoundary", value: function() {
          return this.getFactory().createGeometryCollection();
        } }, { key: "getGeometryType", value: function() {
          return he.TYPENAME_POINT;
        } }, { key: "getCoordinateSequence", value: function() {
          return this._coordinates;
        } }, { key: "getY", value: function() {
          if (this.getCoordinate() === null) throw new IllegalStateException("getY called on empty Point");
          return this.getCoordinate().y;
        } }, { key: "isEmpty", value: function() {
          return this._coordinates.size() === 0;
        } }, { key: "init", value: function(i) {
          i === null && (i = this.getFactory().getCoordinateSequenceFactory().create([])), se.isTrue(i.size() <= 1), this._coordinates = i;
        } }, { key: "isSimple", value: function() {
          return !0;
        } }, { key: "interfaces_", get: function() {
          return [Ni];
        } }], [{ key: "constructor_", value: function() {
          this._coordinates = null;
          var i = arguments[0], a = arguments[1];
          he.constructor_.call(this, a), this.init(i);
        } }]);
      }(he), Tt = function() {
        function o() {
          u(this, o);
        }
        return h(o, null, [{ key: "ofRing", value: function() {
          if (arguments[0] instanceof Array) {
            var t = arguments[0];
            return Math.abs(o.ofRingSigned(t));
          }
          if (Ee(arguments[0], ke)) {
            var i = arguments[0];
            return Math.abs(o.ofRingSigned(i));
          }
        } }, { key: "ofRingSigned", value: function() {
          if (arguments[0] instanceof Array) {
            var t = arguments[0];
            if (t.length < 3) return 0;
            for (var i = 0, a = t[0].x, l = 1; l < t.length - 1; l++) {
              var g = t[l].x - a, p = t[l + 1].y;
              i += g * (t[l - 1].y - p);
            }
            return i / 2;
          }
          if (Ee(arguments[0], ke)) {
            var v = arguments[0], w = v.size();
            if (w < 3) return 0;
            var b = new J(), z = new J(), W = new J();
            v.getCoordinate(0, z), v.getCoordinate(1, W);
            var Q = z.x;
            W.x -= Q;
            for (var le = 0, fe = 1; fe < w - 1; fe++) b.y = z.y, z.x = W.x, z.y = W.y, v.getCoordinate(fe + 1, W), W.x -= Q, le += z.x * (b.y - W.y);
            return le / 2;
          }
        } }]);
      }(), Gt = function() {
        return h(function o() {
          u(this, o);
        }, null, [{ key: "sort", value: function() {
          var o = arguments, t = arguments[0];
          if (arguments.length === 1) t.sort(function(Q, le) {
            return Q.compareTo(le);
          });
          else if (arguments.length === 2) t.sort(function(Q, le) {
            return o[1].compare(Q, le);
          });
          else if (arguments.length === 3) {
            var i = t.slice(arguments[1], arguments[2]);
            i.sort();
            var a = t.slice(0, arguments[1]).concat(i, t.slice(arguments[2], t.length));
            t.splice(0, t.length);
            var l, g = m(a);
            try {
              for (g.s(); !(l = g.n()).done; ) {
                var p = l.value;
                t.push(p);
              }
            } catch (Q) {
              g.e(Q);
            } finally {
              g.f();
            }
          } else if (arguments.length === 4) {
            var v = t.slice(arguments[1], arguments[2]);
            v.sort(function(Q, le) {
              return o[3].compare(Q, le);
            });
            var w = t.slice(0, arguments[1]).concat(v, t.slice(arguments[2], t.length));
            t.splice(0, t.length);
            var b, z = m(w);
            try {
              for (z.s(); !(b = z.n()).done; ) {
                var W = b.value;
                t.push(W);
              }
            } catch (Q) {
              z.e(Q);
            } finally {
              z.f();
            }
          }
        } }, { key: "asList", value: function(o) {
          var t, i = new me(), a = m(o);
          try {
            for (a.s(); !(t = a.n()).done; ) {
              var l = t.value;
              i.add(l);
            }
          } catch (g) {
            a.e(g);
          } finally {
            a.f();
          }
          return i;
        } }, { key: "copyOf", value: function(o, t) {
          return o.slice(0, t);
        } }]);
      }(), Pi = h(function o() {
        u(this, o);
      }), vr = function(o) {
        function t() {
          var i;
          return u(this, t), i = s(this, t), t.constructor_.apply(i, arguments), i;
        }
        return _(t, o), h(t, [{ key: "computeEnvelopeInternal", value: function() {
          return this._shell.getEnvelopeInternal();
        } }, { key: "getCoordinates", value: function() {
          if (this.isEmpty()) return [];
          for (var i = new Array(this.getNumPoints()).fill(null), a = -1, l = this._shell.getCoordinates(), g = 0; g < l.length; g++) i[++a] = l[g];
          for (var p = 0; p < this._holes.length; p++) for (var v = this._holes[p].getCoordinates(), w = 0; w < v.length; w++) i[++a] = v[w];
          return i;
        } }, { key: "getArea", value: function() {
          var i = 0;
          i += Tt.ofRing(this._shell.getCoordinateSequence());
          for (var a = 0; a < this._holes.length; a++) i -= Tt.ofRing(this._holes[a].getCoordinateSequence());
          return i;
        } }, { key: "copyInternal", value: function() {
          for (var i = this._shell.copy(), a = new Array(this._holes.length).fill(null), l = 0; l < this._holes.length; l++) a[l] = this._holes[l].copy();
          return new t(i, a, this._factory);
        } }, { key: "isRectangle", value: function() {
          if (this.getNumInteriorRing() !== 0 || this._shell === null || this._shell.getNumPoints() !== 5) return !1;
          for (var i = this._shell.getCoordinateSequence(), a = this.getEnvelopeInternal(), l = 0; l < 5; l++) {
            var g = i.getX(l);
            if (g !== a.getMinX() && g !== a.getMaxX()) return !1;
            var p = i.getY(l);
            if (p !== a.getMinY() && p !== a.getMaxY()) return !1;
          }
          for (var v = i.getX(0), w = i.getY(0), b = 1; b <= 4; b++) {
            var z = i.getX(b), W = i.getY(b);
            if (z !== v == (W !== w)) return !1;
            v = z, w = W;
          }
          return !0;
        } }, { key: "equalsExact", value: function() {
          if (arguments.length === 2 && typeof arguments[1] == "number" && arguments[0] instanceof he) {
            var i = arguments[0], a = arguments[1];
            if (!this.isEquivalentClass(i)) return !1;
            var l = i, g = this._shell, p = l._shell;
            if (!g.equalsExact(p, a) || this._holes.length !== l._holes.length) return !1;
            for (var v = 0; v < this._holes.length; v++) if (!this._holes[v].equalsExact(l._holes[v], a)) return !1;
            return !0;
          }
          return I(t, "equalsExact", this, 1).apply(this, arguments);
        } }, { key: "normalize", value: function() {
          if (arguments.length === 0) {
            this._shell = this.normalized(this._shell, !0);
            for (var i = 0; i < this._holes.length; i++) this._holes[i] = this.normalized(this._holes[i], !1);
            Gt.sort(this._holes);
          } else if (arguments.length === 2) {
            var a = arguments[0], l = arguments[1];
            if (a.isEmpty()) return null;
            var g = a.getCoordinateSequence(), p = wt.minCoordinateIndex(g, 0, g.size() - 2);
            wt.scroll(g, p, !0), _e.isCCW(g) === l && wt.reverse(g);
          }
        } }, { key: "getCoordinate", value: function() {
          return this._shell.getCoordinate();
        } }, { key: "getNumInteriorRing", value: function() {
          return this._holes.length;
        } }, { key: "getBoundaryDimension", value: function() {
          return 1;
        } }, { key: "reverseInternal", value: function() {
          for (var i = this.getExteriorRing().reverse(), a = new Array(this.getNumInteriorRing()).fill(null), l = 0; l < a.length; l++) a[l] = this.getInteriorRingN(l).reverse();
          return this.getFactory().createPolygon(i, a);
        } }, { key: "getTypeCode", value: function() {
          return he.TYPECODE_POLYGON;
        } }, { key: "getDimension", value: function() {
          return 2;
        } }, { key: "getLength", value: function() {
          var i = 0;
          i += this._shell.getLength();
          for (var a = 0; a < this._holes.length; a++) i += this._holes[a].getLength();
          return i;
        } }, { key: "getNumPoints", value: function() {
          for (var i = this._shell.getNumPoints(), a = 0; a < this._holes.length; a++) i += this._holes[a].getNumPoints();
          return i;
        } }, { key: "convexHull", value: function() {
          return this.getExteriorRing().convexHull();
        } }, { key: "normalized", value: function(i, a) {
          var l = i.copy();
          return this.normalize(l, a), l;
        } }, { key: "compareToSameClass", value: function() {
          if (arguments.length === 1) {
            var i = arguments[0], a = this._shell, l = i._shell;
            return a.compareToSameClass(l);
          }
          if (arguments.length === 2) {
            var g = arguments[1], p = arguments[0], v = this._shell, w = p._shell, b = v.compareToSameClass(w, g);
            if (b !== 0) return b;
            for (var z = this.getNumInteriorRing(), W = p.getNumInteriorRing(), Q = 0; Q < z && Q < W; ) {
              var le = this.getInteriorRingN(Q), fe = p.getInteriorRingN(Q), ve = le.compareToSameClass(fe, g);
              if (ve !== 0) return ve;
              Q++;
            }
            return Q < z ? 1 : Q < W ? -1 : 0;
          }
        } }, { key: "apply", value: function() {
          if (Ee(arguments[0], Ur)) {
            var i = arguments[0];
            this._shell.apply(i);
            for (var a = 0; a < this._holes.length; a++) this._holes[a].apply(i);
          } else if (Ee(arguments[0], Kn)) {
            var l = arguments[0];
            if (this._shell.apply(l), !l.isDone()) for (var g = 0; g < this._holes.length && (this._holes[g].apply(l), !l.isDone()); g++) ;
            l.isGeometryChanged() && this.geometryChanged();
          } else if (Ee(arguments[0], mr))
            arguments[0].filter(this);
          else if (Ee(arguments[0], j)) {
            var p = arguments[0];
            p.filter(this), this._shell.apply(p);
            for (var v = 0; v < this._holes.length; v++) this._holes[v].apply(p);
          }
        } }, { key: "getBoundary", value: function() {
          if (this.isEmpty()) return this.getFactory().createMultiLineString();
          var i = new Array(this._holes.length + 1).fill(null);
          i[0] = this._shell;
          for (var a = 0; a < this._holes.length; a++) i[a + 1] = this._holes[a];
          return i.length <= 1 ? this.getFactory().createLinearRing(i[0].getCoordinateSequence()) : this.getFactory().createMultiLineString(i);
        } }, { key: "getGeometryType", value: function() {
          return he.TYPENAME_POLYGON;
        } }, { key: "getExteriorRing", value: function() {
          return this._shell;
        } }, { key: "isEmpty", value: function() {
          return this._shell.isEmpty();
        } }, { key: "getInteriorRingN", value: function(i) {
          return this._holes[i];
        } }, { key: "interfaces_", get: function() {
          return [Pi];
        } }], [{ key: "constructor_", value: function() {
          this._shell = null, this._holes = null;
          var i = arguments[0], a = arguments[1], l = arguments[2];
          if (he.constructor_.call(this, l), i === null && (i = this.getFactory().createLinearRing()), a === null && (a = []), he.hasNullElements(a)) throw new X("holes must not contain null elements");
          if (i.isEmpty() && he.hasNonEmptyElements(a)) throw new X("shell is empty but holes are not");
          this._shell = i, this._holes = a;
        } }]);
      }(he), Ri = function(o) {
        function t() {
          return u(this, t), s(this, t, arguments);
        }
        return _(t, o), h(t);
      }(Rr), Di = function(o) {
        function t(i) {
          var a;
          return u(this, t), (a = s(this, t)).array = [], i instanceof Pe && a.addAll(i), a;
        }
        return _(t, o), h(t, [{ key: "contains", value: function(i) {
          var a, l = m(this.array);
          try {
            for (l.s(); !(a = l.n()).done; )
              if (a.value.compareTo(i) === 0) return !0;
          } catch (g) {
            l.e(g);
          } finally {
            l.f();
          }
          return !1;
        } }, { key: "add", value: function(i) {
          if (this.contains(i)) return !1;
          for (var a = 0, l = this.array.length; a < l; a++)
            if (this.array[a].compareTo(i) === 1) return !!this.array.splice(a, 0, i);
          return this.array.push(i), !0;
        } }, { key: "addAll", value: function(i) {
          var a, l = m(i);
          try {
            for (l.s(); !(a = l.n()).done; ) {
              var g = a.value;
              this.add(g);
            }
          } catch (p) {
            l.e(p);
          } finally {
            l.f();
          }
          return !0;
        } }, { key: "remove", value: function() {
          throw new Se();
        } }, { key: "size", value: function() {
          return this.array.length;
        } }, { key: "isEmpty", value: function() {
          return this.array.length === 0;
        } }, { key: "toArray", value: function() {
          return this.array.slice();
        } }, { key: "iterator", value: function() {
          return new tn(this.array);
        } }]);
      }(Ri), tn = function() {
        return h(function o(t) {
          u(this, o), this.array = t, this.position = 0;
        }, [{ key: "next", value: function() {
          if (this.position === this.array.length) throw new Oe();
          return this.array[this.position++];
        } }, { key: "hasNext", value: function() {
          return this.position < this.array.length;
        } }, { key: "remove", value: function() {
          throw new Se();
        } }]);
      }(), lt = function(o) {
        function t() {
          var i;
          return u(this, t), i = s(this, t), t.constructor_.apply(i, arguments), i;
        }
        return _(t, o), h(t, [{ key: "computeEnvelopeInternal", value: function() {
          for (var i = new be(), a = 0; a < this._geometries.length; a++) i.expandToInclude(this._geometries[a].getEnvelopeInternal());
          return i;
        } }, { key: "getGeometryN", value: function(i) {
          return this._geometries[i];
        } }, { key: "getCoordinates", value: function() {
          for (var i = new Array(this.getNumPoints()).fill(null), a = -1, l = 0; l < this._geometries.length; l++) for (var g = this._geometries[l].getCoordinates(), p = 0; p < g.length; p++) i[++a] = g[p];
          return i;
        } }, { key: "getArea", value: function() {
          for (var i = 0, a = 0; a < this._geometries.length; a++) i += this._geometries[a].getArea();
          return i;
        } }, { key: "copyInternal", value: function() {
          for (var i = new Array(this._geometries.length).fill(null), a = 0; a < i.length; a++) i[a] = this._geometries[a].copy();
          return new t(i, this._factory);
        } }, { key: "equalsExact", value: function() {
          if (arguments.length === 2 && typeof arguments[1] == "number" && arguments[0] instanceof he) {
            var i = arguments[0], a = arguments[1];
            if (!this.isEquivalentClass(i)) return !1;
            var l = i;
            if (this._geometries.length !== l._geometries.length) return !1;
            for (var g = 0; g < this._geometries.length; g++) if (!this._geometries[g].equalsExact(l._geometries[g], a)) return !1;
            return !0;
          }
          return I(t, "equalsExact", this, 1).apply(this, arguments);
        } }, { key: "normalize", value: function() {
          for (var i = 0; i < this._geometries.length; i++) this._geometries[i].normalize();
          Gt.sort(this._geometries);
        } }, { key: "getCoordinate", value: function() {
          return this.isEmpty() ? null : this._geometries[0].getCoordinate();
        } }, { key: "getBoundaryDimension", value: function() {
          for (var i = ie.FALSE, a = 0; a < this._geometries.length; a++) i = Math.max(i, this._geometries[a].getBoundaryDimension());
          return i;
        } }, { key: "reverseInternal", value: function() {
          for (var i = this._geometries.length, a = new me(i), l = 0; l < i; l++) a.add(this._geometries[l].reverse());
          return this.getFactory().buildGeometry(a);
        } }, { key: "getTypeCode", value: function() {
          return he.TYPECODE_GEOMETRYCOLLECTION;
        } }, { key: "getDimension", value: function() {
          for (var i = ie.FALSE, a = 0; a < this._geometries.length; a++) i = Math.max(i, this._geometries[a].getDimension());
          return i;
        } }, { key: "getLength", value: function() {
          for (var i = 0, a = 0; a < this._geometries.length; a++) i += this._geometries[a].getLength();
          return i;
        } }, { key: "getNumPoints", value: function() {
          for (var i = 0, a = 0; a < this._geometries.length; a++) i += this._geometries[a].getNumPoints();
          return i;
        } }, { key: "getNumGeometries", value: function() {
          return this._geometries.length;
        } }, { key: "compareToSameClass", value: function() {
          if (arguments.length === 1) {
            var i = arguments[0], a = new Di(Gt.asList(this._geometries)), l = new Di(Gt.asList(i._geometries));
            return this.compare(a, l);
          }
          if (arguments.length === 2) {
            for (var g = arguments[1], p = arguments[0], v = this.getNumGeometries(), w = p.getNumGeometries(), b = 0; b < v && b < w; ) {
              var z = this.getGeometryN(b), W = p.getGeometryN(b), Q = z.compareToSameClass(W, g);
              if (Q !== 0) return Q;
              b++;
            }
            return b < v ? 1 : b < w ? -1 : 0;
          }
        } }, { key: "apply", value: function() {
          if (Ee(arguments[0], Ur)) for (var i = arguments[0], a = 0; a < this._geometries.length; a++) this._geometries[a].apply(i);
          else if (Ee(arguments[0], Kn)) {
            var l = arguments[0];
            if (this._geometries.length === 0) return null;
            for (var g = 0; g < this._geometries.length && (this._geometries[g].apply(l), !l.isDone()); g++) ;
            l.isGeometryChanged() && this.geometryChanged();
          } else if (Ee(arguments[0], mr)) {
            var p = arguments[0];
            p.filter(this);
            for (var v = 0; v < this._geometries.length; v++) this._geometries[v].apply(p);
          } else if (Ee(arguments[0], j)) {
            var w = arguments[0];
            w.filter(this);
            for (var b = 0; b < this._geometries.length; b++) this._geometries[b].apply(w);
          }
        } }, { key: "getBoundary", value: function() {
          return he.checkNotGeometryCollection(this), se.shouldNeverReachHere(), null;
        } }, { key: "getGeometryType", value: function() {
          return he.TYPENAME_GEOMETRYCOLLECTION;
        } }, { key: "isEmpty", value: function() {
          for (var i = 0; i < this._geometries.length; i++) if (!this._geometries[i].isEmpty()) return !1;
          return !0;
        } }], [{ key: "constructor_", value: function() {
          if (this._geometries = null, arguments.length !== 0) {
            if (arguments.length === 2) {
              var i = arguments[0], a = arguments[1];
              if (he.constructor_.call(this, a), i === null && (i = []), he.hasNullElements(i)) throw new X("geometries must not contain null elements");
              this._geometries = i;
            }
          }
        } }]);
      }(he), zr = function(o) {
        function t() {
          var i;
          return u(this, t), i = s(this, t), t.constructor_.apply(i, arguments), i;
        }
        return _(t, o), h(t, [{ key: "copyInternal", value: function() {
          for (var i = new Array(this._geometries.length).fill(null), a = 0; a < i.length; a++) i[a] = this._geometries[a].copy();
          return new t(i, this._factory);
        } }, { key: "isValid", value: function() {
          return !0;
        } }, { key: "equalsExact", value: function() {
          if (arguments.length === 2 && typeof arguments[1] == "number" && arguments[0] instanceof he) {
            var i = arguments[0], a = arguments[1];
            return !!this.isEquivalentClass(i) && I(t, "equalsExact", this, 1).call(this, i, a);
          }
          return I(t, "equalsExact", this, 1).apply(this, arguments);
        } }, { key: "getCoordinate", value: function() {
          if (arguments.length === 1 && Number.isInteger(arguments[0])) {
            var i = arguments[0];
            return this._geometries[i].getCoordinate();
          }
          return I(t, "getCoordinate", this, 1).apply(this, arguments);
        } }, { key: "getBoundaryDimension", value: function() {
          return ie.FALSE;
        } }, { key: "getTypeCode", value: function() {
          return he.TYPECODE_MULTIPOINT;
        } }, { key: "getDimension", value: function() {
          return 0;
        } }, { key: "getBoundary", value: function() {
          return this.getFactory().createGeometryCollection();
        } }, { key: "getGeometryType", value: function() {
          return he.TYPENAME_MULTIPOINT;
        } }, { key: "interfaces_", get: function() {
          return [Ni];
        } }], [{ key: "constructor_", value: function() {
          var i = arguments[0], a = arguments[1];
          lt.constructor_.call(this, i, a);
        } }]);
      }(lt), er = function(o) {
        function t() {
          var i;
          return u(this, t), i = s(this, t), t.constructor_.apply(i, arguments), i;
        }
        return _(t, o), h(t, [{ key: "copyInternal", value: function() {
          return new t(this._points.copy(), this._factory);
        } }, { key: "getBoundaryDimension", value: function() {
          return ie.FALSE;
        } }, { key: "isClosed", value: function() {
          return !!this.isEmpty() || I(t, "isClosed", this, 1).call(this);
        } }, { key: "reverseInternal", value: function() {
          var i = this._points.copy();
          return wt.reverse(i), this.getFactory().createLinearRing(i);
        } }, { key: "getTypeCode", value: function() {
          return he.TYPECODE_LINEARRING;
        } }, { key: "validateConstruction", value: function() {
          if (!this.isEmpty() && !I(t, "isClosed", this, 1).call(this)) throw new X("Points of LinearRing do not form a closed linestring");
          if (this.getCoordinateSequence().size() >= 1 && this.getCoordinateSequence().size() < t.MINIMUM_VALID_SIZE) throw new X("Invalid number of points in LinearRing (found " + this.getCoordinateSequence().size() + " - must be 0 or >= 4)");
        } }, { key: "getGeometryType", value: function() {
          return he.TYPENAME_LINEARRING;
        } }], [{ key: "constructor_", value: function() {
          var i = arguments[0], a = arguments[1];
          Qn.constructor_.call(this, i, a), this.validateConstruction();
        } }]);
      }(Qn);
      er.MINIMUM_VALID_SIZE = 4;
      var vn = function(o) {
        function t() {
          var i;
          return u(this, t), i = s(this, t), t.constructor_.apply(i, arguments), i;
        }
        return _(t, o), h(t, [{ key: "setOrdinate", value: function(i, a) {
          switch (i) {
            case t.X:
              this.x = a;
              break;
            case t.Y:
              this.y = a;
              break;
            default:
              throw new X("Invalid ordinate index: " + i);
          }
        } }, { key: "getZ", value: function() {
          return J.NULL_ORDINATE;
        } }, { key: "getOrdinate", value: function(i) {
          switch (i) {
            case t.X:
              return this.x;
            case t.Y:
              return this.y;
          }
          throw new X("Invalid ordinate index: " + i);
        } }, { key: "setZ", value: function(i) {
          throw new X("CoordinateXY dimension 2 does not support z-ordinate");
        } }, { key: "copy", value: function() {
          return new t(this);
        } }, { key: "toString", value: function() {
          return "(" + this.x + ", " + this.y + ")";
        } }, { key: "setCoordinate", value: function(i) {
          this.x = i.x, this.y = i.y, this.z = i.getZ();
        } }], [{ key: "constructor_", value: function() {
          if (arguments.length === 0) J.constructor_.call(this);
          else if (arguments.length === 1) {
            if (arguments[0] instanceof t) {
              var i = arguments[0];
              J.constructor_.call(this, i.x, i.y);
            } else if (arguments[0] instanceof J) {
              var a = arguments[0];
              J.constructor_.call(this, a.x, a.y);
            }
          } else if (arguments.length === 2) {
            var l = arguments[0], g = arguments[1];
            J.constructor_.call(this, l, g, J.NULL_ORDINATE);
          }
        } }]);
      }(J);
      vn.X = 0, vn.Y = 1, vn.Z = -1, vn.M = -1;
      var On = function(o) {
        function t() {
          var i;
          return u(this, t), i = s(this, t), t.constructor_.apply(i, arguments), i;
        }
        return _(t, o), h(t, [{ key: "getM", value: function() {
          return this._m;
        } }, { key: "setOrdinate", value: function(i, a) {
          switch (i) {
            case t.X:
              this.x = a;
              break;
            case t.Y:
              this.y = a;
              break;
            case t.M:
              this._m = a;
              break;
            default:
              throw new X("Invalid ordinate index: " + i);
          }
        } }, { key: "setM", value: function(i) {
          this._m = i;
        } }, { key: "getZ", value: function() {
          return J.NULL_ORDINATE;
        } }, { key: "getOrdinate", value: function(i) {
          switch (i) {
            case t.X:
              return this.x;
            case t.Y:
              return this.y;
            case t.M:
              return this._m;
          }
          throw new X("Invalid ordinate index: " + i);
        } }, { key: "setZ", value: function(i) {
          throw new X("CoordinateXY dimension 2 does not support z-ordinate");
        } }, { key: "copy", value: function() {
          return new t(this);
        } }, { key: "toString", value: function() {
          return "(" + this.x + ", " + this.y + " m=" + this.getM() + ")";
        } }, { key: "setCoordinate", value: function(i) {
          this.x = i.x, this.y = i.y, this.z = i.getZ(), this._m = i.getM();
        } }], [{ key: "constructor_", value: function() {
          if (this._m = null, arguments.length === 0) J.constructor_.call(this), this._m = 0;
          else if (arguments.length === 1) {
            if (arguments[0] instanceof t) {
              var i = arguments[0];
              J.constructor_.call(this, i.x, i.y), this._m = i._m;
            } else if (arguments[0] instanceof J) {
              var a = arguments[0];
              J.constructor_.call(this, a.x, a.y), this._m = this.getM();
            }
          } else if (arguments.length === 3) {
            var l = arguments[0], g = arguments[1], p = arguments[2];
            J.constructor_.call(this, l, g, J.NULL_ORDINATE), this._m = p;
          }
        } }]);
      }(J);
      On.X = 0, On.Y = 1, On.Z = -1, On.M = 2;
      var ge = function(o) {
        function t() {
          var i;
          return u(this, t), i = s(this, t), t.constructor_.apply(i, arguments), i;
        }
        return _(t, o), h(t, [{ key: "getM", value: function() {
          return this._m;
        } }, { key: "setOrdinate", value: function(i, a) {
          switch (i) {
            case J.X:
              this.x = a;
              break;
            case J.Y:
              this.y = a;
              break;
            case J.Z:
              this.z = a;
              break;
            case J.M:
              this._m = a;
              break;
            default:
              throw new X("Invalid ordinate index: " + i);
          }
        } }, { key: "setM", value: function(i) {
          this._m = i;
        } }, { key: "getOrdinate", value: function(i) {
          switch (i) {
            case J.X:
              return this.x;
            case J.Y:
              return this.y;
            case J.Z:
              return this.getZ();
            case J.M:
              return this.getM();
          }
          throw new X("Invalid ordinate index: " + i);
        } }, { key: "copy", value: function() {
          return new t(this);
        } }, { key: "toString", value: function() {
          return "(" + this.x + ", " + this.y + ", " + this.getZ() + " m=" + this.getM() + ")";
        } }, { key: "setCoordinate", value: function(i) {
          this.x = i.x, this.y = i.y, this.z = i.getZ(), this._m = i.getM();
        } }], [{ key: "constructor_", value: function() {
          if (this._m = null, arguments.length === 0) J.constructor_.call(this), this._m = 0;
          else if (arguments.length === 1) {
            if (arguments[0] instanceof t) {
              var i = arguments[0];
              J.constructor_.call(this, i), this._m = i._m;
            } else if (arguments[0] instanceof J) {
              var a = arguments[0];
              J.constructor_.call(this, a), this._m = this.getM();
            }
          } else if (arguments.length === 4) {
            var l = arguments[0], g = arguments[1], p = arguments[2], v = arguments[3];
            J.constructor_.call(this, l, g, p), this._m = v;
          }
        } }]);
      }(J), B = function() {
        function o() {
          u(this, o);
        }
        return h(o, null, [{ key: "measures", value: function(t) {
          return t instanceof vn ? 0 : t instanceof On || t instanceof ge ? 1 : 0;
        } }, { key: "dimension", value: function(t) {
          return t instanceof vn ? 2 : t instanceof On ? 3 : t instanceof ge ? 4 : 3;
        } }, { key: "create", value: function() {
          if (arguments.length === 1) {
            var t = arguments[0];
            return o.create(t, 0);
          }
          if (arguments.length === 2) {
            var i = arguments[0], a = arguments[1];
            return i === 2 ? new vn() : i === 3 && a === 0 ? new J() : i === 3 && a === 1 ? new On() : i === 4 && a === 1 ? new ge() : new J();
          }
        } }]);
      }(), te = function(o) {
        function t() {
          var i;
          return u(this, t), i = s(this, t), t.constructor_.apply(i, arguments), i;
        }
        return _(t, o), h(t, [{ key: "getCoordinate", value: function(i) {
          return this.get(i);
        } }, { key: "addAll", value: function() {
          if (arguments.length === 2 && typeof arguments[1] == "boolean" && Ee(arguments[0], Pe)) {
            for (var i = arguments[1], a = !1, l = arguments[0].iterator(); l.hasNext(); ) this.add(l.next(), i), a = !0;
            return a;
          }
          return I(t, "addAll", this, 1).apply(this, arguments);
        } }, { key: "clone", value: function() {
          for (var i = I(t, "clone", this, 1).call(this), a = 0; a < this.size(); a++) i.add(a, this.get(a).clone());
          return i;
        } }, { key: "toCoordinateArray", value: function() {
          if (arguments.length === 0) return this.toArray(t.coordArrayType);
          if (arguments.length === 1) {
            if (arguments[0]) return this.toArray(t.coordArrayType);
            for (var i = this.size(), a = new Array(i).fill(null), l = 0; l < i; l++) a[l] = this.get(i - l - 1);
            return a;
          }
        } }, { key: "add", value: function() {
          if (arguments.length === 1) {
            var i = arguments[0];
            return I(t, "add", this, 1).call(this, i);
          }
          if (arguments.length === 2) {
            if (arguments[0] instanceof Array && typeof arguments[1] == "boolean") {
              var a = arguments[0], l = arguments[1];
              return this.add(a, l, !0), !0;
            }
            if (arguments[0] instanceof J && typeof arguments[1] == "boolean") {
              var g = arguments[0];
              if (!arguments[1] && this.size() >= 1 && this.get(this.size() - 1).equals2D(g)) return null;
              I(t, "add", this, 1).call(this, g);
            } else if (arguments[0] instanceof Object && typeof arguments[1] == "boolean") {
              var p = arguments[0], v = arguments[1];
              return this.add(p, v), !0;
            }
          } else if (arguments.length === 3) {
            if (typeof arguments[2] == "boolean" && arguments[0] instanceof Array && typeof arguments[1] == "boolean") {
              var w = arguments[0], b = arguments[1];
              if (arguments[2]) for (var z = 0; z < w.length; z++) this.add(w[z], b);
              else for (var W = w.length - 1; W >= 0; W--) this.add(w[W], b);
              return !0;
            }
            if (typeof arguments[2] == "boolean" && Number.isInteger(arguments[0]) && arguments[1] instanceof J) {
              var Q = arguments[0], le = arguments[1];
              if (!arguments[2]) {
                var fe = this.size();
                if (fe > 0 && (Q > 0 && this.get(Q - 1).equals2D(le) || Q < fe && this.get(Q).equals2D(le)))
                  return null;
              }
              I(t, "add", this, 1).call(this, Q, le);
            }
          } else if (arguments.length === 4) {
            var ve = arguments[0], Te = arguments[1], Ie = arguments[2], Fe = arguments[3], ot = 1;
            Ie > Fe && (ot = -1);
            for (var ct = Ie; ct !== Fe; ct += ot) this.add(ve[ct], Te);
            return !0;
          }
        } }, { key: "closeRing", value: function() {
          if (this.size() > 0) {
            var i = this.get(0).copy();
            this.add(i, !1);
          }
        } }], [{ key: "constructor_", value: function() {
          if (arguments.length !== 0) {
            if (arguments.length === 1) {
              var i = arguments[0];
              this.ensureCapacity(i.length), this.add(i, !0);
            } else if (arguments.length === 2) {
              var a = arguments[0], l = arguments[1];
              this.ensureCapacity(a.length), this.add(a, l);
            }
          }
        } }]);
      }(me);
      te.coordArrayType = new Array(0).fill(null);
      var oe = function() {
        function o() {
          u(this, o);
        }
        return h(o, null, [{ key: "isRing", value: function(t) {
          return !(t.length < 4) && !!t[0].equals2D(t[t.length - 1]);
        } }, { key: "ptNotInList", value: function(t, i) {
          for (var a = 0; a < t.length; a++) {
            var l = t[a];
            if (o.indexOf(l, i) < 0) return l;
          }
          return null;
        } }, { key: "scroll", value: function(t, i) {
          var a = o.indexOf(i, t);
          if (a < 0) return null;
          var l = new Array(t.length).fill(null);
          at.arraycopy(t, a, l, 0, t.length - a), at.arraycopy(t, 0, l, t.length - a, a), at.arraycopy(l, 0, t, 0, t.length);
        } }, { key: "equals", value: function() {
          if (arguments.length === 2) {
            var t = arguments[0], i = arguments[1];
            if (t === i) return !0;
            if (t === null || i === null || t.length !== i.length) return !1;
            for (var a = 0; a < t.length; a++) if (!t[a].equals(i[a])) return !1;
            return !0;
          }
          if (arguments.length === 3) {
            var l = arguments[0], g = arguments[1], p = arguments[2];
            if (l === g) return !0;
            if (l === null || g === null || l.length !== g.length) return !1;
            for (var v = 0; v < l.length; v++) if (p.compare(l[v], g[v]) !== 0) return !1;
            return !0;
          }
        } }, { key: "intersection", value: function(t, i) {
          for (var a = new te(), l = 0; l < t.length; l++) i.intersects(t[l]) && a.add(t[l], !0);
          return a.toCoordinateArray();
        } }, { key: "measures", value: function(t) {
          if (t === null || t.length === 0) return 0;
          var i, a = 0, l = m(t);
          try {
            for (l.s(); !(i = l.n()).done; ) {
              var g = i.value;
              a = Math.max(a, B.measures(g));
            }
          } catch (p) {
            l.e(p);
          } finally {
            l.f();
          }
          return a;
        } }, { key: "hasRepeatedPoints", value: function(t) {
          for (var i = 1; i < t.length; i++) if (t[i - 1].equals(t[i])) return !0;
          return !1;
        } }, { key: "removeRepeatedPoints", value: function(t) {
          return o.hasRepeatedPoints(t) ? new te(t, !1).toCoordinateArray() : t;
        } }, { key: "reverse", value: function(t) {
          for (var i = t.length - 1, a = Math.trunc(i / 2), l = 0; l <= a; l++) {
            var g = t[l];
            t[l] = t[i - l], t[i - l] = g;
          }
        } }, { key: "removeNull", value: function(t) {
          for (var i = 0, a = 0; a < t.length; a++) t[a] !== null && i++;
          var l = new Array(i).fill(null);
          if (i === 0) return l;
          for (var g = 0, p = 0; p < t.length; p++) t[p] !== null && (l[g++] = t[p]);
          return l;
        } }, { key: "copyDeep", value: function() {
          if (arguments.length === 1) {
            for (var t = arguments[0], i = new Array(t.length).fill(null), a = 0; a < t.length; a++) i[a] = t[a].copy();
            return i;
          }
          if (arguments.length === 5) for (var l = arguments[0], g = arguments[1], p = arguments[2], v = arguments[3], w = arguments[4], b = 0; b < w; b++) p[v + b] = l[g + b].copy();
        } }, { key: "isEqualReversed", value: function(t, i) {
          for (var a = 0; a < t.length; a++) {
            var l = t[a], g = i[t.length - a - 1];
            if (l.compareTo(g) !== 0) return !1;
          }
          return !0;
        } }, { key: "envelope", value: function(t) {
          for (var i = new be(), a = 0; a < t.length; a++) i.expandToInclude(t[a]);
          return i;
        } }, { key: "toCoordinateArray", value: function(t) {
          return t.toArray(o.coordArrayType);
        } }, { key: "dimension", value: function(t) {
          if (t === null || t.length === 0) return 3;
          var i, a = 0, l = m(t);
          try {
            for (l.s(); !(i = l.n()).done; ) {
              var g = i.value;
              a = Math.max(a, B.dimension(g));
            }
          } catch (p) {
            l.e(p);
          } finally {
            l.f();
          }
          return a;
        } }, { key: "atLeastNCoordinatesOrNothing", value: function(t, i) {
          return i.length >= t ? i : [];
        } }, { key: "indexOf", value: function(t, i) {
          for (var a = 0; a < i.length; a++) if (t.equals(i[a])) return a;
          return -1;
        } }, { key: "increasingDirection", value: function(t) {
          for (var i = 0; i < Math.trunc(t.length / 2); i++) {
            var a = t.length - 1 - i, l = t[i].compareTo(t[a]);
            if (l !== 0) return l;
          }
          return 1;
        } }, { key: "compare", value: function(t, i) {
          for (var a = 0; a < t.length && a < i.length; ) {
            var l = t[a].compareTo(i[a]);
            if (l !== 0) return l;
            a++;
          }
          return a < i.length ? -1 : a < t.length ? 1 : 0;
        } }, { key: "minCoordinate", value: function(t) {
          for (var i = null, a = 0; a < t.length; a++) (i === null || i.compareTo(t[a]) > 0) && (i = t[a]);
          return i;
        } }, { key: "extract", value: function(t, i, a) {
          i = mn.clamp(i, 0, t.length);
          var l = (a = mn.clamp(a, -1, t.length)) - i + 1;
          a < 0 && (l = 0), i >= t.length && (l = 0), a < i && (l = 0);
          var g = new Array(l).fill(null);
          if (l === 0) return g;
          for (var p = 0, v = i; v <= a; v++) g[p++] = t[v];
          return g;
        } }]);
      }(), Be = function() {
        return h(function o() {
          u(this, o);
        }, [{ key: "compare", value: function(o, t) {
          var i = o, a = t;
          return oe.compare(i, a);
        } }, { key: "interfaces_", get: function() {
          return [re];
        } }]);
      }(), et = function() {
        return h(function o() {
          u(this, o);
        }, [{ key: "compare", value: function(o, t) {
          var i = o, a = t;
          if (i.length < a.length) return -1;
          if (i.length > a.length) return 1;
          if (i.length === 0) return 0;
          var l = oe.compare(i, a);
          return oe.isEqualReversed(i, a) ? 0 : l;
        } }, { key: "OLDcompare", value: function(o, t) {
          var i = o, a = t;
          if (i.length < a.length) return -1;
          if (i.length > a.length) return 1;
          if (i.length === 0) return 0;
          for (var l = oe.increasingDirection(i), g = oe.increasingDirection(a), p = l > 0 ? 0 : i.length - 1, v = g > 0 ? 0 : i.length - 1, w = 0; w < i.length; w++) {
            var b = i[p].compareTo(a[v]);
            if (b !== 0) return b;
            p += l, v += g;
          }
          return 0;
        } }, { key: "interfaces_", get: function() {
          return [re];
        } }]);
      }();
      oe.ForwardComparator = Be, oe.BidirectionalComparator = et, oe.coordArrayType = new Array(0).fill(null);
      var We = function() {
        return h(function o(t) {
          u(this, o), this.str = t;
        }, [{ key: "append", value: function(o) {
          this.str += o;
        } }, { key: "setCharAt", value: function(o, t) {
          this.str = this.str.substr(0, o) + t + this.str.substr(o + 1);
        } }, { key: "toString", value: function() {
          return this.str;
        } }]);
      }(), je = function() {
        function o() {
          u(this, o), o.constructor_.apply(this, arguments);
        }
        return h(o, [{ key: "getM", value: function(t) {
          return this.hasM() ? this._coordinates[t].getM() : K.NaN;
        } }, { key: "setOrdinate", value: function(t, i, a) {
          switch (i) {
            case ke.X:
              this._coordinates[t].x = a;
              break;
            case ke.Y:
              this._coordinates[t].y = a;
              break;
            default:
              this._coordinates[t].setOrdinate(i, a);
          }
        } }, { key: "getZ", value: function(t) {
          return this.hasZ() ? this._coordinates[t].getZ() : K.NaN;
        } }, { key: "size", value: function() {
          return this._coordinates.length;
        } }, { key: "getOrdinate", value: function(t, i) {
          switch (i) {
            case ke.X:
              return this._coordinates[t].x;
            case ke.Y:
              return this._coordinates[t].y;
            default:
              return this._coordinates[t].getOrdinate(i);
          }
        } }, { key: "getCoordinate", value: function() {
          if (arguments.length === 1) {
            var t = arguments[0];
            return this._coordinates[t];
          }
          if (arguments.length === 2) {
            var i = arguments[0];
            arguments[1].setCoordinate(this._coordinates[i]);
          }
        } }, { key: "getCoordinateCopy", value: function(t) {
          var i = this.createCoordinate();
          return i.setCoordinate(this._coordinates[t]), i;
        } }, { key: "createCoordinate", value: function() {
          return B.create(this.getDimension(), this.getMeasures());
        } }, { key: "getDimension", value: function() {
          return this._dimension;
        } }, { key: "getX", value: function(t) {
          return this._coordinates[t].x;
        } }, { key: "getMeasures", value: function() {
          return this._measures;
        } }, { key: "expandEnvelope", value: function(t) {
          for (var i = 0; i < this._coordinates.length; i++) t.expandToInclude(this._coordinates[i]);
          return t;
        } }, { key: "copy", value: function() {
          for (var t = new Array(this.size()).fill(null), i = 0; i < this._coordinates.length; i++) {
            var a = this.createCoordinate();
            a.setCoordinate(this._coordinates[i]), t[i] = a;
          }
          return new o(t, this._dimension, this._measures);
        } }, { key: "toString", value: function() {
          if (this._coordinates.length > 0) {
            var t = new We(17 * this._coordinates.length);
            t.append("("), t.append(this._coordinates[0]);
            for (var i = 1; i < this._coordinates.length; i++) t.append(", "), t.append(this._coordinates[i]);
            return t.append(")"), t.toString();
          }
          return "()";
        } }, { key: "getY", value: function(t) {
          return this._coordinates[t].y;
        } }, { key: "toCoordinateArray", value: function() {
          return this._coordinates;
        } }, { key: "interfaces_", get: function() {
          return [ke, k];
        } }], [{ key: "constructor_", value: function() {
          if (this._dimension = 3, this._measures = 0, this._coordinates = null, arguments.length === 1) {
            if (arguments[0] instanceof Array) {
              var t = arguments[0];
              o.constructor_.call(this, t, oe.dimension(t), oe.measures(t));
            } else if (Number.isInteger(arguments[0])) {
              var i = arguments[0];
              this._coordinates = new Array(i).fill(null);
              for (var a = 0; a < i; a++) this._coordinates[a] = new J();
            } else if (Ee(arguments[0], ke)) {
              var l = arguments[0];
              if (l === null) return this._coordinates = new Array(0).fill(null), null;
              this._dimension = l.getDimension(), this._measures = l.getMeasures(), this._coordinates = new Array(l.size()).fill(null);
              for (var g = 0; g < this._coordinates.length; g++) this._coordinates[g] = l.getCoordinateCopy(g);
            }
          } else if (arguments.length === 2) {
            if (arguments[0] instanceof Array && Number.isInteger(arguments[1])) {
              var p = arguments[0], v = arguments[1];
              o.constructor_.call(this, p, v, oe.measures(p));
            } else if (Number.isInteger(arguments[0]) && Number.isInteger(arguments[1])) {
              var w = arguments[0], b = arguments[1];
              this._coordinates = new Array(w).fill(null), this._dimension = b;
              for (var z = 0; z < w; z++) this._coordinates[z] = B.create(b);
            }
          } else if (arguments.length === 3) {
            if (Number.isInteger(arguments[2]) && arguments[0] instanceof Array && Number.isInteger(arguments[1])) {
              var W = arguments[0], Q = arguments[1], le = arguments[2];
              this._dimension = Q, this._measures = le, this._coordinates = W === null ? new Array(0).fill(null) : W;
            } else if (Number.isInteger(arguments[2]) && Number.isInteger(arguments[0]) && Number.isInteger(arguments[1])) {
              var fe = arguments[0], ve = arguments[1], Te = arguments[2];
              this._coordinates = new Array(fe).fill(null), this._dimension = ve, this._measures = Te;
              for (var Ie = 0; Ie < fe; Ie++) this._coordinates[Ie] = this.createCoordinate();
            }
          }
        } }]);
      }(), kt = function() {
        function o() {
          u(this, o);
        }
        return h(o, [{ key: "readResolve", value: function() {
          return o.instance();
        } }, { key: "create", value: function() {
          if (arguments.length === 1) {
            if (arguments[0] instanceof Array) return new je(arguments[0]);
            if (Ee(arguments[0], ke)) return new je(arguments[0]);
          } else {
            if (arguments.length === 2) {
              var t = arguments[1];
              return t > 3 && (t = 3), t < 2 && (t = 2), new je(arguments[0], t);
            }
            if (arguments.length === 3) {
              var i = arguments[2], a = arguments[1] - i;
              return i > 1 && (i = 1), a > 3 && (a = 3), a < 2 && (a = 2), new je(arguments[0], a + i, i);
            }
          }
        } }, { key: "interfaces_", get: function() {
          return [$n, k];
        } }], [{ key: "instance", value: function() {
          return o.instanceObject;
        } }]);
      }();
      kt.instanceObject = new kt();
      var Pn = function(o) {
        function t() {
          var i;
          return u(this, t), i = s(this, t), t.constructor_.apply(i, arguments), i;
        }
        return _(t, o), h(t, [{ key: "copyInternal", value: function() {
          for (var i = new Array(this._geometries.length).fill(null), a = 0; a < i.length; a++) i[a] = this._geometries[a].copy();
          return new t(i, this._factory);
        } }, { key: "equalsExact", value: function() {
          if (arguments.length === 2 && typeof arguments[1] == "number" && arguments[0] instanceof he) {
            var i = arguments[0], a = arguments[1];
            return !!this.isEquivalentClass(i) && I(t, "equalsExact", this, 1).call(this, i, a);
          }
          return I(t, "equalsExact", this, 1).apply(this, arguments);
        } }, { key: "getBoundaryDimension", value: function() {
          return 1;
        } }, { key: "getTypeCode", value: function() {
          return he.TYPECODE_MULTIPOLYGON;
        } }, { key: "getDimension", value: function() {
          return 2;
        } }, { key: "getBoundary", value: function() {
          if (this.isEmpty()) return this.getFactory().createMultiLineString();
          for (var i = new me(), a = 0; a < this._geometries.length; a++) for (var l = this._geometries[a].getBoundary(), g = 0; g < l.getNumGeometries(); g++) i.add(l.getGeometryN(g));
          var p = new Array(i.size()).fill(null);
          return this.getFactory().createMultiLineString(i.toArray(p));
        } }, { key: "getGeometryType", value: function() {
          return he.TYPENAME_MULTIPOLYGON;
        } }, { key: "interfaces_", get: function() {
          return [Pi];
        } }], [{ key: "constructor_", value: function() {
          var i = arguments[0], a = arguments[1];
          lt.constructor_.call(this, i, a);
        } }]);
      }(lt), tt = function() {
        return h(function o() {
          u(this, o);
        }, [{ key: "get", value: function() {
        } }, { key: "put", value: function() {
        } }, { key: "size", value: function() {
        } }, { key: "values", value: function() {
        } }, { key: "entrySet", value: function() {
        } }]);
      }(), Ts = function(o) {
        function t() {
          var i;
          return u(this, t), (i = s(this, t)).map = /* @__PURE__ */ new Map(), i;
        }
        return _(t, o), h(t, [{ key: "get", value: function(i) {
          return this.map.get(i) || null;
        } }, { key: "put", value: function(i, a) {
          return this.map.set(i, a), a;
        } }, { key: "values", value: function() {
          for (var i = new me(), a = this.map.values(), l = a.next(); !l.done; ) i.add(l.value), l = a.next();
          return i;
        } }, { key: "entrySet", value: function() {
          var i = new pn();
          return this.map.entries().forEach(function(a) {
            return i.add(a);
          }), i;
        } }, { key: "size", value: function() {
          return this.map.size();
        } }]);
      }(tt), St = function() {
        function o() {
          u(this, o), o.constructor_.apply(this, arguments);
        }
        return h(o, [{ key: "equals", value: function(t) {
          if (!(t instanceof o)) return !1;
          var i = t;
          return this._modelType === i._modelType && this._scale === i._scale;
        } }, { key: "compareTo", value: function(t) {
          var i = t, a = this.getMaximumSignificantDigits(), l = i.getMaximumSignificantDigits();
          return Qt.compare(a, l);
        } }, { key: "getScale", value: function() {
          return this._scale;
        } }, { key: "isFloating", value: function() {
          return this._modelType === o.FLOATING || this._modelType === o.FLOATING_SINGLE;
        } }, { key: "getType", value: function() {
          return this._modelType;
        } }, { key: "toString", value: function() {
          var t = "UNKNOWN";
          return this._modelType === o.FLOATING ? t = "Floating" : this._modelType === o.FLOATING_SINGLE ? t = "Floating-Single" : this._modelType === o.FIXED && (t = "Fixed (Scale=" + this.getScale() + ")"), t;
        } }, { key: "makePrecise", value: function() {
          if (typeof arguments[0] == "number") {
            var t = arguments[0];
            return K.isNaN(t) || this._modelType === o.FLOATING_SINGLE ? t : this._modelType === o.FIXED ? Math.round(t * this._scale) / this._scale : t;
          }
          if (arguments[0] instanceof J) {
            var i = arguments[0];
            if (this._modelType === o.FLOATING) return null;
            i.x = this.makePrecise(i.x), i.y = this.makePrecise(i.y);
          }
        } }, { key: "getMaximumSignificantDigits", value: function() {
          var t = 16;
          return this._modelType === o.FLOATING ? t = 16 : this._modelType === o.FLOATING_SINGLE ? t = 6 : this._modelType === o.FIXED && (t = 1 + Math.trunc(Math.ceil(Math.log(this.getScale()) / Math.log(10)))), t;
        } }, { key: "setScale", value: function(t) {
          this._scale = Math.abs(t);
        } }, { key: "interfaces_", get: function() {
          return [k, $];
        } }], [{ key: "constructor_", value: function() {
          if (this._modelType = null, this._scale = null, arguments.length === 0) this._modelType = o.FLOATING;
          else if (arguments.length === 1) {
            if (arguments[0] instanceof qr) {
              var t = arguments[0];
              this._modelType = t, t === o.FIXED && this.setScale(1);
            } else if (typeof arguments[0] == "number") {
              var i = arguments[0];
              this._modelType = o.FIXED, this.setScale(i);
            } else if (arguments[0] instanceof o) {
              var a = arguments[0];
              this._modelType = a._modelType, this._scale = a._scale;
            }
          }
        } }, { key: "mostPrecise", value: function(t, i) {
          return t.compareTo(i) >= 0 ? t : i;
        } }]);
      }(), qr = function() {
        function o() {
          u(this, o), o.constructor_.apply(this, arguments);
        }
        return h(o, [{ key: "readResolve", value: function() {
          return o.nameToTypeMap.get(this._name);
        } }, { key: "toString", value: function() {
          return this._name;
        } }, { key: "interfaces_", get: function() {
          return [k];
        } }], [{ key: "constructor_", value: function() {
          this._name = null;
          var t = arguments[0];
          this._name = t, o.nameToTypeMap.put(t, this);
        } }]);
      }();
      qr.nameToTypeMap = new Ts(), St.Type = qr, St.FIXED = new qr("FIXED"), St.FLOATING = new qr("FLOATING"), St.FLOATING_SINGLE = new qr("FLOATING SINGLE"), St.maximumPreciseValue = 9007199254740992;
      var ro = function(o) {
        function t() {
          var i;
          return u(this, t), i = s(this, t), t.constructor_.apply(i, arguments), i;
        }
        return _(t, o), h(t, [{ key: "copyInternal", value: function() {
          for (var i = new Array(this._geometries.length).fill(null), a = 0; a < i.length; a++) i[a] = this._geometries[a].copy();
          return new t(i, this._factory);
        } }, { key: "equalsExact", value: function() {
          if (arguments.length === 2 && typeof arguments[1] == "number" && arguments[0] instanceof he) {
            var i = arguments[0], a = arguments[1];
            return !!this.isEquivalentClass(i) && I(t, "equalsExact", this, 1).call(this, i, a);
          }
          return I(t, "equalsExact", this, 1).apply(this, arguments);
        } }, { key: "getBoundaryDimension", value: function() {
          return this.isClosed() ? ie.FALSE : 0;
        } }, { key: "isClosed", value: function() {
          if (this.isEmpty()) return !1;
          for (var i = 0; i < this._geometries.length; i++) if (!this._geometries[i].isClosed()) return !1;
          return !0;
        } }, { key: "getTypeCode", value: function() {
          return he.TYPECODE_MULTILINESTRING;
        } }, { key: "getDimension", value: function() {
          return 1;
        } }, { key: "getBoundary", value: function() {
          throw new Se();
        } }, { key: "getGeometryType", value: function() {
          return he.TYPENAME_MULTILINESTRING;
        } }, { key: "interfaces_", get: function() {
          return [Ze];
        } }], [{ key: "constructor_", value: function() {
          var i = arguments[0], a = arguments[1];
          lt.constructor_.call(this, i, a);
        } }]);
      }(lt), Yr = function() {
        function o() {
          u(this, o), o.constructor_.apply(this, arguments);
        }
        return h(o, [{ key: "createEmpty", value: function(t) {
          switch (t) {
            case -1:
              return this.createGeometryCollection();
            case 0:
              return this.createPoint();
            case 1:
              return this.createLineString();
            case 2:
              return this.createPolygon();
            default:
              throw new X("Invalid dimension: " + t);
          }
        } }, { key: "toGeometry", value: function(t) {
          return t.isNull() ? this.createPoint() : t.getMinX() === t.getMaxX() && t.getMinY() === t.getMaxY() ? this.createPoint(new J(t.getMinX(), t.getMinY())) : t.getMinX() === t.getMaxX() || t.getMinY() === t.getMaxY() ? this.createLineString([new J(t.getMinX(), t.getMinY()), new J(t.getMaxX(), t.getMaxY())]) : this.createPolygon(this.createLinearRing([new J(t.getMinX(), t.getMinY()), new J(t.getMinX(), t.getMaxY()), new J(t.getMaxX(), t.getMaxY()), new J(t.getMaxX(), t.getMinY()), new J(t.getMinX(), t.getMinY())]), null);
        } }, { key: "createLineString", value: function() {
          if (arguments.length === 0) return this.createLineString(this.getCoordinateSequenceFactory().create([]));
          if (arguments.length === 1) {
            if (arguments[0] instanceof Array) {
              var t = arguments[0];
              return this.createLineString(t !== null ? this.getCoordinateSequenceFactory().create(t) : null);
            }
            if (Ee(arguments[0], ke)) return new Qn(arguments[0], this);
          }
        } }, { key: "createMultiLineString", value: function() {
          return arguments.length === 0 ? new ro(null, this) : arguments.length === 1 ? new ro(arguments[0], this) : void 0;
        } }, { key: "buildGeometry", value: function(t) {
          for (var i = null, a = !1, l = !1, g = t.iterator(); g.hasNext(); ) {
            var p = g.next(), v = p.getTypeCode();
            i === null && (i = v), v !== i && (a = !0), p instanceof lt && (l = !0);
          }
          if (i === null) return this.createGeometryCollection();
          if (a || l) return this.createGeometryCollection(o.toGeometryArray(t));
          var w = t.iterator().next();
          if (t.size() > 1) {
            if (w instanceof vr) return this.createMultiPolygon(o.toPolygonArray(t));
            if (w instanceof Qn) return this.createMultiLineString(o.toLineStringArray(t));
            if (w instanceof Oi) return this.createMultiPoint(o.toPointArray(t));
            se.shouldNeverReachHere("Unhandled geometry type: " + w.getGeometryType());
          }
          return w;
        } }, { key: "createMultiPointFromCoords", value: function(t) {
          return this.createMultiPoint(t !== null ? this.getCoordinateSequenceFactory().create(t) : null);
        } }, { key: "createPoint", value: function() {
          if (arguments.length === 0) return this.createPoint(this.getCoordinateSequenceFactory().create([]));
          if (arguments.length === 1) {
            if (arguments[0] instanceof J) {
              var t = arguments[0];
              return this.createPoint(t !== null ? this.getCoordinateSequenceFactory().create([t]) : null);
            }
            if (Ee(arguments[0], ke)) return new Oi(arguments[0], this);
          }
        } }, { key: "getCoordinateSequenceFactory", value: function() {
          return this._coordinateSequenceFactory;
        } }, { key: "createPolygon", value: function() {
          if (arguments.length === 0) return this.createPolygon(null, null);
          if (arguments.length === 1) {
            if (Ee(arguments[0], ke)) {
              var t = arguments[0];
              return this.createPolygon(this.createLinearRing(t));
            }
            if (arguments[0] instanceof Array) {
              var i = arguments[0];
              return this.createPolygon(this.createLinearRing(i));
            }
            if (arguments[0] instanceof er) {
              var a = arguments[0];
              return this.createPolygon(a, null);
            }
          } else if (arguments.length === 2)
            return new vr(arguments[0], arguments[1], this);
        } }, { key: "getSRID", value: function() {
          return this._SRID;
        } }, { key: "createGeometryCollection", value: function() {
          return arguments.length === 0 ? new lt(null, this) : arguments.length === 1 ? new lt(arguments[0], this) : void 0;
        } }, { key: "getPrecisionModel", value: function() {
          return this._precisionModel;
        } }, { key: "createLinearRing", value: function() {
          if (arguments.length === 0) return this.createLinearRing(this.getCoordinateSequenceFactory().create([]));
          if (arguments.length === 1) {
            if (arguments[0] instanceof Array) {
              var t = arguments[0];
              return this.createLinearRing(t !== null ? this.getCoordinateSequenceFactory().create(t) : null);
            }
            if (Ee(arguments[0], ke)) return new er(arguments[0], this);
          }
        } }, { key: "createMultiPolygon", value: function() {
          return arguments.length === 0 ? new Pn(null, this) : arguments.length === 1 ? new Pn(arguments[0], this) : void 0;
        } }, { key: "createMultiPoint", value: function() {
          if (arguments.length === 0) return new zr(null, this);
          if (arguments.length === 1) {
            if (arguments[0] instanceof Array) return new zr(arguments[0], this);
            if (Ee(arguments[0], ke)) {
              var t = arguments[0];
              if (t === null) return this.createMultiPoint(new Array(0).fill(null));
              for (var i = new Array(t.size()).fill(null), a = 0; a < t.size(); a++) {
                var l = this.getCoordinateSequenceFactory().create(1, t.getDimension(), t.getMeasures());
                wt.copy(t, a, l, 0, 1), i[a] = this.createPoint(l);
              }
              return this.createMultiPoint(i);
            }
          }
        } }, { key: "interfaces_", get: function() {
          return [k];
        } }], [{ key: "constructor_", value: function() {
          if (this._precisionModel = null, this._coordinateSequenceFactory = null, this._SRID = null, arguments.length === 0) o.constructor_.call(this, new St(), 0);
          else if (arguments.length === 1) {
            if (Ee(arguments[0], $n)) {
              var t = arguments[0];
              o.constructor_.call(this, new St(), 0, t);
            } else if (arguments[0] instanceof St) {
              var i = arguments[0];
              o.constructor_.call(this, i, 0, o.getDefaultCoordinateSequenceFactory());
            }
          } else if (arguments.length === 2) {
            var a = arguments[0], l = arguments[1];
            o.constructor_.call(this, a, l, o.getDefaultCoordinateSequenceFactory());
          } else if (arguments.length === 3) {
            var g = arguments[0], p = arguments[1], v = arguments[2];
            this._precisionModel = g, this._coordinateSequenceFactory = v, this._SRID = p;
          }
        } }, { key: "toMultiPolygonArray", value: function(t) {
          var i = new Array(t.size()).fill(null);
          return t.toArray(i);
        } }, { key: "toGeometryArray", value: function(t) {
          if (t === null) return null;
          var i = new Array(t.size()).fill(null);
          return t.toArray(i);
        } }, { key: "getDefaultCoordinateSequenceFactory", value: function() {
          return kt.instance();
        } }, { key: "toMultiLineStringArray", value: function(t) {
          var i = new Array(t.size()).fill(null);
          return t.toArray(i);
        } }, { key: "toLineStringArray", value: function(t) {
          var i = new Array(t.size()).fill(null);
          return t.toArray(i);
        } }, { key: "toMultiPointArray", value: function(t) {
          var i = new Array(t.size()).fill(null);
          return t.toArray(i);
        } }, { key: "toLinearRingArray", value: function(t) {
          var i = new Array(t.size()).fill(null);
          return t.toArray(i);
        } }, { key: "toPointArray", value: function(t) {
          var i = new Array(t.size()).fill(null);
          return t.toArray(i);
        } }, { key: "toPolygonArray", value: function(t) {
          var i = new Array(t.size()).fill(null);
          return t.toArray(i);
        } }, { key: "createPointFromInternalCoord", value: function(t, i) {
          return i.getPrecisionModel().makePrecise(t), i.getFactory().createPoint(t);
        } }]);
      }(), io = "XY", Cd = "XYZ", Ad = "XYM", Nd = "XYZM", ml = { POINT: "Point", LINE_STRING: "LineString", LINEAR_RING: "LinearRing", POLYGON: "Polygon", MULTI_POINT: "MultiPoint", MULTI_LINE_STRING: "MultiLineString", MULTI_POLYGON: "MultiPolygon", GEOMETRY_COLLECTION: "GeometryCollection", CIRCLE: "Circle" }, vl = "EMPTY", Ls = 1, Rn = 2, tr = 3, yl = 4, Hr = 5, Od = 6;
      for (var Pd in ml) ml[Pd].toUpperCase();
      var Rd = function() {
        return h(function o(t) {
          u(this, o), this.wkt = t, this.index_ = -1;
        }, [{ key: "isAlpha_", value: function(o) {
          return o >= "a" && o <= "z" || o >= "A" && o <= "Z";
        } }, { key: "isNumeric_", value: function(o, t) {
          return o >= "0" && o <= "9" || o == "." && !(t !== void 0 && t);
        } }, { key: "isWhiteSpace_", value: function(o) {
          return o == " " || o == "	" || o == "\r" || o == `
`;
        } }, { key: "nextChar_", value: function() {
          return this.wkt.charAt(++this.index_);
        } }, { key: "nextToken", value: function() {
          var o, t = this.nextChar_(), i = this.index_, a = t;
          if (t == "(") o = Rn;
          else if (t == ",") o = Hr;
          else if (t == ")") o = tr;
          else if (this.isNumeric_(t) || t == "-") o = yl, a = this.readNumber_();
          else if (this.isAlpha_(t)) o = Ls, a = this.readText_();
          else {
            if (this.isWhiteSpace_(t)) return this.nextToken();
            if (t !== "") throw new Error("Unexpected character: " + t);
            o = Od;
          }
          return { position: i, value: a, type: o };
        } }, { key: "readNumber_", value: function() {
          var o, t = this.index_, i = !1, a = !1;
          do
            o == "." ? i = !0 : o != "e" && o != "E" || (a = !0), o = this.nextChar_();
          while (this.isNumeric_(o, i) || !a && (o == "e" || o == "E") || a && (o == "-" || o == "+"));
          return parseFloat(this.wkt.substring(t, this.index_--));
        } }, { key: "readText_", value: function() {
          var o, t = this.index_;
          do
            o = this.nextChar_();
          while (this.isAlpha_(o));
          return this.wkt.substring(t, this.index_--).toUpperCase();
        } }]);
      }(), Dd = function() {
        return h(function o(t, i) {
          u(this, o), this.lexer_ = t, this.token_, this.layout_ = io, this.factory = i;
        }, [{ key: "consume_", value: function() {
          this.token_ = this.lexer_.nextToken();
        } }, { key: "isTokenType", value: function(o) {
          return this.token_.type == o;
        } }, { key: "match", value: function(o) {
          var t = this.isTokenType(o);
          return t && this.consume_(), t;
        } }, { key: "parse", value: function() {
          return this.consume_(), this.parseGeometry_();
        } }, { key: "parseGeometryLayout_", value: function() {
          var o = io, t = this.token_;
          if (this.isTokenType(Ls)) {
            var i = t.value;
            i === "Z" ? o = Cd : i === "M" ? o = Ad : i === "ZM" && (o = Nd), o !== io && this.consume_();
          }
          return o;
        } }, { key: "parseGeometryCollectionText_", value: function() {
          if (this.match(Rn)) {
            var o = [];
            do
              o.push(this.parseGeometry_());
            while (this.match(Hr));
            if (this.match(tr)) return o;
          } else if (this.isEmptyGeometry_()) return [];
          throw new Error(this.formatErrorMessage_());
        } }, { key: "parsePointText_", value: function() {
          if (this.match(Rn)) {
            var o = this.parsePoint_();
            if (this.match(tr)) return o;
          } else if (this.isEmptyGeometry_()) return null;
          throw new Error(this.formatErrorMessage_());
        } }, { key: "parseLineStringText_", value: function() {
          if (this.match(Rn)) {
            var o = this.parsePointList_();
            if (this.match(tr)) return o;
          } else if (this.isEmptyGeometry_()) return [];
          throw new Error(this.formatErrorMessage_());
        } }, { key: "parsePolygonText_", value: function() {
          if (this.match(Rn)) {
            var o = this.parseLineStringTextList_();
            if (this.match(tr)) return o;
          } else if (this.isEmptyGeometry_()) return [];
          throw new Error(this.formatErrorMessage_());
        } }, { key: "parseMultiPointText_", value: function() {
          var o;
          if (this.match(Rn)) {
            if (o = this.token_.type == Rn ? this.parsePointTextList_() : this.parsePointList_(), this.match(tr)) return o;
          } else if (this.isEmptyGeometry_()) return [];
          throw new Error(this.formatErrorMessage_());
        } }, { key: "parseMultiLineStringText_", value: function() {
          if (this.match(Rn)) {
            var o = this.parseLineStringTextList_();
            if (this.match(tr)) return o;
          } else if (this.isEmptyGeometry_()) return [];
          throw new Error(this.formatErrorMessage_());
        } }, { key: "parseMultiPolygonText_", value: function() {
          if (this.match(Rn)) {
            var o = this.parsePolygonTextList_();
            if (this.match(tr)) return o;
          } else if (this.isEmptyGeometry_()) return [];
          throw new Error(this.formatErrorMessage_());
        } }, { key: "parsePoint_", value: function() {
          for (var o = [], t = this.layout_.length, i = 0; i < t; ++i) {
            var a = this.token_;
            if (!this.match(yl)) break;
            o.push(a.value);
          }
          if (o.length == t) return o;
          throw new Error(this.formatErrorMessage_());
        } }, { key: "parsePointList_", value: function() {
          for (var o = [this.parsePoint_()]; this.match(Hr); ) o.push(this.parsePoint_());
          return o;
        } }, { key: "parsePointTextList_", value: function() {
          for (var o = [this.parsePointText_()]; this.match(Hr); ) o.push(this.parsePointText_());
          return o;
        } }, { key: "parseLineStringTextList_", value: function() {
          for (var o = [this.parseLineStringText_()]; this.match(Hr); ) o.push(this.parseLineStringText_());
          return o;
        } }, { key: "parsePolygonTextList_", value: function() {
          for (var o = [this.parsePolygonText_()]; this.match(Hr); ) o.push(this.parsePolygonText_());
          return o;
        } }, { key: "isEmptyGeometry_", value: function() {
          var o = this.isTokenType(Ls) && this.token_.value == vl;
          return o && this.consume_(), o;
        } }, { key: "formatErrorMessage_", value: function() {
          return "Unexpected `" + this.token_.value + "` at position " + this.token_.position + " in `" + this.lexer_.wkt + "`";
        } }, { key: "parseGeometry_", value: function() {
          var o = this.factory, t = function(ve) {
            return c(J, D(ve));
          }, i = function(ve) {
            var Te = ve.map(function(Ie) {
              return o.createLinearRing(Ie.map(t));
            });
            return Te.length > 1 ? o.createPolygon(Te[0], Te.slice(1)) : o.createPolygon(Te[0]);
          }, a = this.token_;
          if (this.match(Ls)) {
            var l = a.value;
            if (this.layout_ = this.parseGeometryLayout_(), l == "GEOMETRYCOLLECTION") {
              var g = this.parseGeometryCollectionText_();
              return o.createGeometryCollection(g);
            }
            switch (l) {
              case "POINT":
                var p = this.parsePointText_();
                return p ? o.createPoint(c(J, D(p))) : o.createPoint();
              case "LINESTRING":
                var v = this.parseLineStringText_().map(t);
                return o.createLineString(v);
              case "LINEARRING":
                var w = this.parseLineStringText_().map(t);
                return o.createLinearRing(w);
              case "POLYGON":
                var b = this.parsePolygonText_();
                return b && b.length !== 0 ? i(b) : o.createPolygon();
              case "MULTIPOINT":
                var z = this.parseMultiPointText_();
                if (!z || z.length === 0) return o.createMultiPoint();
                var W = z.map(t).map(function(ve) {
                  return o.createPoint(ve);
                });
                return o.createMultiPoint(W);
              case "MULTILINESTRING":
                var Q = this.parseMultiLineStringText_().map(function(ve) {
                  return o.createLineString(ve.map(t));
                });
                return o.createMultiLineString(Q);
              case "MULTIPOLYGON":
                var le = this.parseMultiPolygonText_();
                if (!le || le.length === 0) return o.createMultiPolygon();
                var fe = le.map(i);
                return o.createMultiPolygon(fe);
              default:
                throw new Error("Invalid geometry type: " + l);
            }
          }
          throw new Error(this.formatErrorMessage_());
        } }]);
      }();
      function _l(o) {
        if (o.isEmpty()) return "";
        var t = o.getCoordinate(), i = [t.x, t.y];
        return t.z === void 0 || Number.isNaN(t.z) || i.push(t.z), t.m === void 0 || Number.isNaN(t.m) || i.push(t.m), i.join(" ");
      }
      function Fi(o) {
        for (var t = o.getCoordinates().map(function(g) {
          var p = [g.x, g.y];
          return g.z === void 0 || Number.isNaN(g.z) || p.push(g.z), g.m === void 0 || Number.isNaN(g.m) || p.push(g.m), p;
        }), i = [], a = 0, l = t.length; a < l; ++a) i.push(t[a].join(" "));
        return i.join(", ");
      }
      function El(o) {
        var t = [];
        t.push("(" + Fi(o.getExteriorRing()) + ")");
        for (var i = 0, a = o.getNumInteriorRing(); i < a; ++i) t.push("(" + Fi(o.getInteriorRingN(i)) + ")");
        return t.join(", ");
      }
      var Fd = { Point: _l, LineString: Fi, LinearRing: Fi, Polygon: El, MultiPoint: function(o) {
        for (var t = [], i = 0, a = o.getNumGeometries(); i < a; ++i) t.push("(" + _l(o.getGeometryN(i)) + ")");
        return t.join(", ");
      }, MultiLineString: function(o) {
        for (var t = [], i = 0, a = o.getNumGeometries(); i < a; ++i) t.push("(" + Fi(o.getGeometryN(i)) + ")");
        return t.join(", ");
      }, MultiPolygon: function(o) {
        for (var t = [], i = 0, a = o.getNumGeometries(); i < a; ++i) t.push("(" + El(o.getGeometryN(i)) + ")");
        return t.join(", ");
      }, GeometryCollection: function(o) {
        for (var t = [], i = 0, a = o.getNumGeometries(); i < a; ++i) t.push(xl(o.getGeometryN(i)));
        return t.join(", ");
      } };
      function xl(o) {
        var t = o.getGeometryType(), i = Fd[t];
        t = t.toUpperCase();
        var a = function(l) {
          var g = "";
          if (l.isEmpty()) return g;
          var p = l.getCoordinate();
          return p.z === void 0 || Number.isNaN(p.z) || (g += "Z"), p.m === void 0 || Number.isNaN(p.m) || (g += "M"), g;
        }(o);
        return a.length > 0 && (t += " " + a), o.isEmpty() ? t + " " + vl : t + " (" + i(o) + ")";
      }
      var Gd = function() {
        return h(function o(t) {
          u(this, o), this.geometryFactory = t || new Yr(), this.precisionModel = this.geometryFactory.getPrecisionModel();
        }, [{ key: "read", value: function(o) {
          var t = new Rd(o);
          return new Dd(t, this.geometryFactory).parse();
        } }, { key: "write", value: function(o) {
          return xl(o);
        } }]);
      }(), so = function() {
        return h(function o(t) {
          u(this, o), this.parser = new Gd(t);
        }, [{ key: "write", value: function(o) {
          return this.parser.write(o);
        } }], [{ key: "toLineString", value: function(o, t) {
          if (arguments.length !== 2) throw new Error("Not implemented");
          return "LINESTRING ( " + o.x + " " + o.y + ", " + t.x + " " + t.y + " )";
        } }]);
      }(), qe = function() {
        function o() {
          u(this, o), o.constructor_.apply(this, arguments);
        }
        return h(o, [{ key: "getIndexAlongSegment", value: function(t, i) {
          return this.computeIntLineIndex(), this._intLineIndex[t][i];
        } }, { key: "getTopologySummary", value: function() {
          var t = new We();
          return this.isEndPoint() && t.append(" endpoint"), this._isProper && t.append(" proper"), this.isCollinear() && t.append(" collinear"), t.toString();
        } }, { key: "computeIntersection", value: function(t, i, a, l) {
          this._inputLines[0][0] = t, this._inputLines[0][1] = i, this._inputLines[1][0] = a, this._inputLines[1][1] = l, this._result = this.computeIntersect(t, i, a, l);
        } }, { key: "getIntersectionNum", value: function() {
          return this._result;
        } }, { key: "computeIntLineIndex", value: function() {
          if (arguments.length === 0) this._intLineIndex === null && (this._intLineIndex = Array(2).fill().map(function() {
            return Array(2);
          }), this.computeIntLineIndex(0), this.computeIntLineIndex(1));
          else if (arguments.length === 1) {
            var t = arguments[0];
            this.getEdgeDistance(t, 0) > this.getEdgeDistance(t, 1) ? (this._intLineIndex[t][0] = 0, this._intLineIndex[t][1] = 1) : (this._intLineIndex[t][0] = 1, this._intLineIndex[t][1] = 0);
          }
        } }, { key: "isProper", value: function() {
          return this.hasIntersection() && this._isProper;
        } }, { key: "setPrecisionModel", value: function(t) {
          this._precisionModel = t;
        } }, { key: "isInteriorIntersection", value: function() {
          if (arguments.length === 0) return !!this.isInteriorIntersection(0) || !!this.isInteriorIntersection(1);
          if (arguments.length === 1) {
            for (var t = arguments[0], i = 0; i < this._result; i++) if (!this._intPt[i].equals2D(this._inputLines[t][0]) && !this._intPt[i].equals2D(this._inputLines[t][1])) return !0;
            return !1;
          }
        } }, { key: "getIntersection", value: function(t) {
          return this._intPt[t];
        } }, { key: "isEndPoint", value: function() {
          return this.hasIntersection() && !this._isProper;
        } }, { key: "hasIntersection", value: function() {
          return this._result !== o.NO_INTERSECTION;
        } }, { key: "getEdgeDistance", value: function(t, i) {
          return o.computeEdgeDistance(this._intPt[i], this._inputLines[t][0], this._inputLines[t][1]);
        } }, { key: "isCollinear", value: function() {
          return this._result === o.COLLINEAR_INTERSECTION;
        } }, { key: "toString", value: function() {
          return so.toLineString(this._inputLines[0][0], this._inputLines[0][1]) + " - " + so.toLineString(this._inputLines[1][0], this._inputLines[1][1]) + this.getTopologySummary();
        } }, { key: "getEndpoint", value: function(t, i) {
          return this._inputLines[t][i];
        } }, { key: "isIntersection", value: function(t) {
          for (var i = 0; i < this._result; i++) if (this._intPt[i].equals2D(t)) return !0;
          return !1;
        } }, { key: "getIntersectionAlongSegment", value: function(t, i) {
          return this.computeIntLineIndex(), this._intPt[this._intLineIndex[t][i]];
        } }], [{ key: "constructor_", value: function() {
          this._result = null, this._inputLines = Array(2).fill().map(function() {
            return Array(2);
          }), this._intPt = new Array(2).fill(null), this._intLineIndex = null, this._isProper = null, this._pa = null, this._pb = null, this._precisionModel = null, this._intPt[0] = new J(), this._intPt[1] = new J(), this._pa = this._intPt[0], this._pb = this._intPt[1], this._result = 0;
        } }, { key: "computeEdgeDistance", value: function(t, i, a) {
          var l = Math.abs(a.x - i.x), g = Math.abs(a.y - i.y), p = -1;
          if (t.equals(i)) p = 0;
          else if (t.equals(a)) p = l > g ? l : g;
          else {
            var v = Math.abs(t.x - i.x), w = Math.abs(t.y - i.y);
            (p = l > g ? v : w) !== 0 || t.equals(i) || (p = Math.max(v, w));
          }
          return se.isTrue(!(p === 0 && !t.equals(i)), "Bad distance calculation"), p;
        } }, { key: "nonRobustComputeEdgeDistance", value: function(t, i, a) {
          var l = t.x - i.x, g = t.y - i.y, p = Math.sqrt(l * l + g * g);
          return se.isTrue(!(p === 0 && !t.equals(i)), "Invalid distance calculation"), p;
        } }]);
      }();
      qe.DONT_INTERSECT = 0, qe.DO_INTERSECT = 1, qe.COLLINEAR = 2, qe.NO_INTERSECTION = 0, qe.POINT_INTERSECTION = 1, qe.COLLINEAR_INTERSECTION = 2;
      var yr = function(o) {
        function t() {
          return u(this, t), s(this, t);
        }
        return _(t, o), h(t, [{ key: "isInSegmentEnvelopes", value: function(i) {
          var a = new be(this._inputLines[0][0], this._inputLines[0][1]), l = new be(this._inputLines[1][0], this._inputLines[1][1]);
          return a.contains(i) && l.contains(i);
        } }, { key: "computeIntersection", value: function() {
          if (arguments.length !== 3) return I(t, "computeIntersection", this, 1).apply(this, arguments);
          var i = arguments[0], a = arguments[1], l = arguments[2];
          if (this._isProper = !1, be.intersects(a, l, i) && _e.index(a, l, i) === 0 && _e.index(l, a, i) === 0) return this._isProper = !0, (i.equals(a) || i.equals(l)) && (this._isProper = !1), this._result = qe.POINT_INTERSECTION, null;
          this._result = qe.NO_INTERSECTION;
        } }, { key: "intersection", value: function(i, a, l, g) {
          var p = this.intersectionSafe(i, a, l, g);
          return this.isInSegmentEnvelopes(p) || (p = new J(t.nearestEndpoint(i, a, l, g))), this._precisionModel !== null && this._precisionModel.makePrecise(p), p;
        } }, { key: "checkDD", value: function(i, a, l, g, p) {
          var v = Gr.intersection(i, a, l, g), w = this.isInSegmentEnvelopes(v);
          at.out.println("DD in env = " + w + "  --------------------- " + v), p.distance(v) > 1e-4 && at.out.println("Distance = " + p.distance(v));
        } }, { key: "intersectionSafe", value: function(i, a, l, g) {
          var p = Ai.intersection(i, a, l, g);
          return p === null && (p = t.nearestEndpoint(i, a, l, g)), p;
        } }, { key: "computeCollinearIntersection", value: function(i, a, l, g) {
          var p = be.intersects(i, a, l), v = be.intersects(i, a, g), w = be.intersects(l, g, i), b = be.intersects(l, g, a);
          return p && v ? (this._intPt[0] = l, this._intPt[1] = g, qe.COLLINEAR_INTERSECTION) : w && b ? (this._intPt[0] = i, this._intPt[1] = a, qe.COLLINEAR_INTERSECTION) : p && w ? (this._intPt[0] = l, this._intPt[1] = i, !l.equals(i) || v || b ? qe.COLLINEAR_INTERSECTION : qe.POINT_INTERSECTION) : p && b ? (this._intPt[0] = l, this._intPt[1] = a, !l.equals(a) || v || w ? qe.COLLINEAR_INTERSECTION : qe.POINT_INTERSECTION) : v && w ? (this._intPt[0] = g, this._intPt[1] = i, !g.equals(i) || p || b ? qe.COLLINEAR_INTERSECTION : qe.POINT_INTERSECTION) : v && b ? (this._intPt[0] = g, this._intPt[1] = a, !g.equals(a) || p || w ? qe.COLLINEAR_INTERSECTION : qe.POINT_INTERSECTION) : qe.NO_INTERSECTION;
        } }, { key: "computeIntersect", value: function(i, a, l, g) {
          if (this._isProper = !1, !be.intersects(i, a, l, g)) return qe.NO_INTERSECTION;
          var p = _e.index(i, a, l), v = _e.index(i, a, g);
          if (p > 0 && v > 0 || p < 0 && v < 0) return qe.NO_INTERSECTION;
          var w = _e.index(l, g, i), b = _e.index(l, g, a);
          return w > 0 && b > 0 || w < 0 && b < 0 ? qe.NO_INTERSECTION : p === 0 && v === 0 && w === 0 && b === 0 ? this.computeCollinearIntersection(i, a, l, g) : (p === 0 || v === 0 || w === 0 || b === 0 ? (this._isProper = !1, i.equals2D(l) || i.equals2D(g) ? this._intPt[0] = i : a.equals2D(l) || a.equals2D(g) ? this._intPt[0] = a : p === 0 ? this._intPt[0] = new J(l) : v === 0 ? this._intPt[0] = new J(g) : w === 0 ? this._intPt[0] = new J(i) : b === 0 && (this._intPt[0] = new J(a))) : (this._isProper = !0, this._intPt[0] = this.intersection(i, a, l, g)), qe.POINT_INTERSECTION);
        } }], [{ key: "nearestEndpoint", value: function(i, a, l, g) {
          var p = i, v = Ft.pointToSegment(i, l, g), w = Ft.pointToSegment(a, l, g);
          return w < v && (v = w, p = a), (w = Ft.pointToSegment(l, i, a)) < v && (v = w, p = l), (w = Ft.pointToSegment(g, i, a)) < v && (v = w, p = g), p;
        } }]);
      }(qe), Bd = function() {
        function o() {
          u(this, o), o.constructor_.apply(this, arguments);
        }
        return h(o, [{ key: "countSegment", value: function(t, i) {
          if (t.x < this._p.x && i.x < this._p.x) return null;
          if (this._p.x === i.x && this._p.y === i.y) return this._isPointOnSegment = !0, null;
          if (t.y === this._p.y && i.y === this._p.y) {
            var a = t.x, l = i.x;
            return a > l && (a = i.x, l = t.x), this._p.x >= a && this._p.x <= l && (this._isPointOnSegment = !0), null;
          }
          if (t.y > this._p.y && i.y <= this._p.y || i.y > this._p.y && t.y <= this._p.y) {
            var g = _e.index(t, i, this._p);
            if (g === _e.COLLINEAR) return this._isPointOnSegment = !0, null;
            i.y < t.y && (g = -g), g === _e.LEFT && this._crossingCount++;
          }
        } }, { key: "isPointInPolygon", value: function() {
          return this.getLocation() !== C.EXTERIOR;
        } }, { key: "getLocation", value: function() {
          return this._isPointOnSegment ? C.BOUNDARY : this._crossingCount % 2 == 1 ? C.INTERIOR : C.EXTERIOR;
        } }, { key: "isOnSegment", value: function() {
          return this._isPointOnSegment;
        } }], [{ key: "constructor_", value: function() {
          this._p = null, this._crossingCount = 0, this._isPointOnSegment = !1;
          var t = arguments[0];
          this._p = t;
        } }, { key: "locatePointInRing", value: function() {
          if (arguments[0] instanceof J && Ee(arguments[1], ke)) {
            for (var t = arguments[1], i = new o(arguments[0]), a = new J(), l = new J(), g = 1; g < t.size(); g++) if (t.getCoordinate(g, a), t.getCoordinate(g - 1, l), i.countSegment(a, l), i.isOnSegment()) return i.getLocation();
            return i.getLocation();
          }
          if (arguments[0] instanceof J && arguments[1] instanceof Array) {
            for (var p = arguments[1], v = new o(arguments[0]), w = 1; w < p.length; w++) {
              var b = p[w], z = p[w - 1];
              if (v.countSegment(b, z), v.isOnSegment()) return v.getLocation();
            }
            return v.getLocation();
          }
        } }]);
      }(), ao = function() {
        function o() {
          u(this, o);
        }
        return h(o, null, [{ key: "isOnLine", value: function() {
          if (arguments[0] instanceof J && Ee(arguments[1], ke)) {
            for (var t = arguments[0], i = arguments[1], a = new yr(), l = new J(), g = new J(), p = i.size(), v = 1; v < p; v++) if (i.getCoordinate(v - 1, l), i.getCoordinate(v, g), a.computeIntersection(t, l, g), a.hasIntersection()) return !0;
            return !1;
          }
          if (arguments[0] instanceof J && arguments[1] instanceof Array) {
            for (var w = arguments[0], b = arguments[1], z = new yr(), W = 1; W < b.length; W++) {
              var Q = b[W - 1], le = b[W];
              if (z.computeIntersection(w, Q, le), z.hasIntersection()) return !0;
            }
            return !1;
          }
        } }, { key: "locateInRing", value: function(t, i) {
          return Bd.locatePointInRing(t, i);
        } }, { key: "isInRing", value: function(t, i) {
          return o.locateInRing(t, i) !== C.EXTERIOR;
        } }]);
      }(), Bt = function() {
        function o() {
          u(this, o), o.constructor_.apply(this, arguments);
        }
        return h(o, [{ key: "setAllLocations", value: function(t) {
          for (var i = 0; i < this.location.length; i++) this.location[i] = t;
        } }, { key: "isNull", value: function() {
          for (var t = 0; t < this.location.length; t++) if (this.location[t] !== C.NONE) return !1;
          return !0;
        } }, { key: "setAllLocationsIfNull", value: function(t) {
          for (var i = 0; i < this.location.length; i++) this.location[i] === C.NONE && (this.location[i] = t);
        } }, { key: "isLine", value: function() {
          return this.location.length === 1;
        } }, { key: "merge", value: function(t) {
          if (t.location.length > this.location.length) {
            var i = new Array(3).fill(null);
            i[ne.ON] = this.location[ne.ON], i[ne.LEFT] = C.NONE, i[ne.RIGHT] = C.NONE, this.location = i;
          }
          for (var a = 0; a < this.location.length; a++) this.location[a] === C.NONE && a < t.location.length && (this.location[a] = t.location[a]);
        } }, { key: "getLocations", value: function() {
          return this.location;
        } }, { key: "flip", value: function() {
          if (this.location.length <= 1) return null;
          var t = this.location[ne.LEFT];
          this.location[ne.LEFT] = this.location[ne.RIGHT], this.location[ne.RIGHT] = t;
        } }, { key: "toString", value: function() {
          var t = new Dt();
          return this.location.length > 1 && t.append(C.toLocationSymbol(this.location[ne.LEFT])), t.append(C.toLocationSymbol(this.location[ne.ON])), this.location.length > 1 && t.append(C.toLocationSymbol(this.location[ne.RIGHT])), t.toString();
        } }, { key: "setLocations", value: function(t, i, a) {
          this.location[ne.ON] = t, this.location[ne.LEFT] = i, this.location[ne.RIGHT] = a;
        } }, { key: "get", value: function(t) {
          return t < this.location.length ? this.location[t] : C.NONE;
        } }, { key: "isArea", value: function() {
          return this.location.length > 1;
        } }, { key: "isAnyNull", value: function() {
          for (var t = 0; t < this.location.length; t++) if (this.location[t] === C.NONE) return !0;
          return !1;
        } }, { key: "setLocation", value: function() {
          if (arguments.length === 1) {
            var t = arguments[0];
            this.setLocation(ne.ON, t);
          } else if (arguments.length === 2) {
            var i = arguments[0], a = arguments[1];
            this.location[i] = a;
          }
        } }, { key: "init", value: function(t) {
          this.location = new Array(t).fill(null), this.setAllLocations(C.NONE);
        } }, { key: "isEqualOnSide", value: function(t, i) {
          return this.location[i] === t.location[i];
        } }, { key: "allPositionsEqual", value: function(t) {
          for (var i = 0; i < this.location.length; i++) if (this.location[i] !== t) return !1;
          return !0;
        } }], [{ key: "constructor_", value: function() {
          if (this.location = null, arguments.length === 1) {
            if (arguments[0] instanceof Array) {
              var t = arguments[0];
              this.init(t.length);
            } else if (Number.isInteger(arguments[0])) {
              var i = arguments[0];
              this.init(1), this.location[ne.ON] = i;
            } else if (arguments[0] instanceof o) {
              var a = arguments[0];
              if (this.init(a.location.length), a !== null) for (var l = 0; l < this.location.length; l++) this.location[l] = a.location[l];
            }
          } else if (arguments.length === 3) {
            var g = arguments[0], p = arguments[1], v = arguments[2];
            this.init(3), this.location[ne.ON] = g, this.location[ne.LEFT] = p, this.location[ne.RIGHT] = v;
          }
        } }]);
      }(), Ut = function() {
        function o() {
          u(this, o), o.constructor_.apply(this, arguments);
        }
        return h(o, [{ key: "getGeometryCount", value: function() {
          var t = 0;
          return this.elt[0].isNull() || t++, this.elt[1].isNull() || t++, t;
        } }, { key: "setAllLocations", value: function(t, i) {
          this.elt[t].setAllLocations(i);
        } }, { key: "isNull", value: function(t) {
          return this.elt[t].isNull();
        } }, { key: "setAllLocationsIfNull", value: function() {
          if (arguments.length === 1) {
            var t = arguments[0];
            this.setAllLocationsIfNull(0, t), this.setAllLocationsIfNull(1, t);
          } else if (arguments.length === 2) {
            var i = arguments[0], a = arguments[1];
            this.elt[i].setAllLocationsIfNull(a);
          }
        } }, { key: "isLine", value: function(t) {
          return this.elt[t].isLine();
        } }, { key: "merge", value: function(t) {
          for (var i = 0; i < 2; i++) this.elt[i] === null && t.elt[i] !== null ? this.elt[i] = new Bt(t.elt[i]) : this.elt[i].merge(t.elt[i]);
        } }, { key: "flip", value: function() {
          this.elt[0].flip(), this.elt[1].flip();
        } }, { key: "getLocation", value: function() {
          if (arguments.length === 1) {
            var t = arguments[0];
            return this.elt[t].get(ne.ON);
          }
          if (arguments.length === 2) {
            var i = arguments[0], a = arguments[1];
            return this.elt[i].get(a);
          }
        } }, { key: "toString", value: function() {
          var t = new Dt();
          return this.elt[0] !== null && (t.append("A:"), t.append(this.elt[0].toString())), this.elt[1] !== null && (t.append(" B:"), t.append(this.elt[1].toString())), t.toString();
        } }, { key: "isArea", value: function() {
          if (arguments.length === 0) return this.elt[0].isArea() || this.elt[1].isArea();
          if (arguments.length === 1) {
            var t = arguments[0];
            return this.elt[t].isArea();
          }
        } }, { key: "isAnyNull", value: function(t) {
          return this.elt[t].isAnyNull();
        } }, { key: "setLocation", value: function() {
          if (arguments.length === 2) {
            var t = arguments[0], i = arguments[1];
            this.elt[t].setLocation(ne.ON, i);
          } else if (arguments.length === 3) {
            var a = arguments[0], l = arguments[1], g = arguments[2];
            this.elt[a].setLocation(l, g);
          }
        } }, { key: "isEqualOnSide", value: function(t, i) {
          return this.elt[0].isEqualOnSide(t.elt[0], i) && this.elt[1].isEqualOnSide(t.elt[1], i);
        } }, { key: "allPositionsEqual", value: function(t, i) {
          return this.elt[t].allPositionsEqual(i);
        } }, { key: "toLine", value: function(t) {
          this.elt[t].isArea() && (this.elt[t] = new Bt(this.elt[t].location[0]));
        } }], [{ key: "constructor_", value: function() {
          if (this.elt = new Array(2).fill(null), arguments.length === 1) {
            if (Number.isInteger(arguments[0])) {
              var t = arguments[0];
              this.elt[0] = new Bt(t), this.elt[1] = new Bt(t);
            } else if (arguments[0] instanceof o) {
              var i = arguments[0];
              this.elt[0] = new Bt(i.elt[0]), this.elt[1] = new Bt(i.elt[1]);
            }
          } else if (arguments.length === 2) {
            var a = arguments[0], l = arguments[1];
            this.elt[0] = new Bt(C.NONE), this.elt[1] = new Bt(C.NONE), this.elt[a].setLocation(l);
          } else if (arguments.length === 3) {
            var g = arguments[0], p = arguments[1], v = arguments[2];
            this.elt[0] = new Bt(g, p, v), this.elt[1] = new Bt(g, p, v);
          } else if (arguments.length === 4) {
            var w = arguments[0], b = arguments[1], z = arguments[2], W = arguments[3];
            this.elt[0] = new Bt(C.NONE, C.NONE, C.NONE), this.elt[1] = new Bt(C.NONE, C.NONE, C.NONE), this.elt[w].setLocations(b, z, W);
          }
        } }, { key: "toLineLabel", value: function(t) {
          for (var i = new o(C.NONE), a = 0; a < 2; a++) i.setLocation(a, t.getLocation(a));
          return i;
        } }]);
      }(), Cs = function() {
        return h(function o() {
          u(this, o), o.constructor_.apply(this, arguments);
        }, [{ key: "computeRing", value: function() {
          if (this._ring !== null) return null;
          for (var o = new Array(this._pts.size()).fill(null), t = 0; t < this._pts.size(); t++) o[t] = this._pts.get(t);
          this._ring = this._geometryFactory.createLinearRing(o), this._isHole = _e.isCCW(this._ring.getCoordinates());
        } }, { key: "isIsolated", value: function() {
          return this._label.getGeometryCount() === 1;
        } }, { key: "computePoints", value: function(o) {
          this._startDe = o;
          var t = o, i = !0;
          do {
            if (t === null) throw new xt("Found null DirectedEdge");
            if (t.getEdgeRing() === this) throw new xt("Directed Edge visited twice during ring-building at " + t.getCoordinate());
            this._edges.add(t);
            var a = t.getLabel();
            se.isTrue(a.isArea()), this.mergeLabel(a), this.addPoints(t.getEdge(), t.isForward(), i), i = !1, this.setEdgeRing(t, this), t = this.getNext(t);
          } while (t !== this._startDe);
        } }, { key: "getLinearRing", value: function() {
          return this._ring;
        } }, { key: "getCoordinate", value: function(o) {
          return this._pts.get(o);
        } }, { key: "computeMaxNodeDegree", value: function() {
          this._maxNodeDegree = 0;
          var o = this._startDe;
          do {
            var t = o.getNode().getEdges().getOutgoingDegree(this);
            t > this._maxNodeDegree && (this._maxNodeDegree = t), o = this.getNext(o);
          } while (o !== this._startDe);
          this._maxNodeDegree *= 2;
        } }, { key: "addPoints", value: function(o, t, i) {
          var a = o.getCoordinates();
          if (t) {
            var l = 1;
            i && (l = 0);
            for (var g = l; g < a.length; g++) this._pts.add(a[g]);
          } else {
            var p = a.length - 2;
            i && (p = a.length - 1);
            for (var v = p; v >= 0; v--) this._pts.add(a[v]);
          }
        } }, { key: "isHole", value: function() {
          return this._isHole;
        } }, { key: "setInResult", value: function() {
          var o = this._startDe;
          do
            o.getEdge().setInResult(!0), o = o.getNext();
          while (o !== this._startDe);
        } }, { key: "containsPoint", value: function(o) {
          var t = this.getLinearRing();
          if (!t.getEnvelopeInternal().contains(o) || !ao.isInRing(o, t.getCoordinates())) return !1;
          for (var i = this._holes.iterator(); i.hasNext(); )
            if (i.next().containsPoint(o)) return !1;
          return !0;
        } }, { key: "addHole", value: function(o) {
          this._holes.add(o);
        } }, { key: "isShell", value: function() {
          return this._shell === null;
        } }, { key: "getLabel", value: function() {
          return this._label;
        } }, { key: "getEdges", value: function() {
          return this._edges;
        } }, { key: "getMaxNodeDegree", value: function() {
          return this._maxNodeDegree < 0 && this.computeMaxNodeDegree(), this._maxNodeDegree;
        } }, { key: "getShell", value: function() {
          return this._shell;
        } }, { key: "mergeLabel", value: function() {
          if (arguments.length === 1) {
            var o = arguments[0];
            this.mergeLabel(o, 0), this.mergeLabel(o, 1);
          } else if (arguments.length === 2) {
            var t = arguments[1], i = arguments[0].getLocation(t, ne.RIGHT);
            if (i === C.NONE) return null;
            if (this._label.getLocation(t) === C.NONE) return this._label.setLocation(t, i), null;
          }
        } }, { key: "setShell", value: function(o) {
          this._shell = o, o !== null && o.addHole(this);
        } }, { key: "toPolygon", value: function(o) {
          for (var t = new Array(this._holes.size()).fill(null), i = 0; i < this._holes.size(); i++) t[i] = this._holes.get(i).getLinearRing();
          return o.createPolygon(this.getLinearRing(), t);
        } }], [{ key: "constructor_", value: function() {
          if (this._startDe = null, this._maxNodeDegree = -1, this._edges = new me(), this._pts = new me(), this._label = new Ut(C.NONE), this._ring = null, this._isHole = null, this._shell = null, this._holes = new me(), this._geometryFactory = null, arguments.length !== 0) {
            if (arguments.length === 2) {
              var o = arguments[0], t = arguments[1];
              this._geometryFactory = t, this.computePoints(o), this.computeRing();
            }
          }
        } }]);
      }(), Ud = function(o) {
        function t() {
          var i;
          return u(this, t), i = s(this, t), t.constructor_.apply(i, arguments), i;
        }
        return _(t, o), h(t, [{ key: "setEdgeRing", value: function(i, a) {
          i.setMinEdgeRing(a);
        } }, { key: "getNext", value: function(i) {
          return i.getNextMin();
        } }], [{ key: "constructor_", value: function() {
          var i = arguments[0], a = arguments[1];
          Cs.constructor_.call(this, i, a);
        } }]);
      }(Cs), zd = function(o) {
        function t() {
          var i;
          return u(this, t), i = s(this, t), t.constructor_.apply(i, arguments), i;
        }
        return _(t, o), h(t, [{ key: "buildMinimalRings", value: function() {
          var i = new me(), a = this._startDe;
          do {
            if (a.getMinEdgeRing() === null) {
              var l = new Ud(a, this._geometryFactory);
              i.add(l);
            }
            a = a.getNext();
          } while (a !== this._startDe);
          return i;
        } }, { key: "setEdgeRing", value: function(i, a) {
          i.setEdgeRing(a);
        } }, { key: "linkDirectedEdgesForMinimalEdgeRings", value: function() {
          var i = this._startDe;
          do
            i.getNode().getEdges().linkMinimalDirectedEdges(this), i = i.getNext();
          while (i !== this._startDe);
        } }, { key: "getNext", value: function(i) {
          return i.getNext();
        } }], [{ key: "constructor_", value: function() {
          var i = arguments[0], a = arguments[1];
          Cs.constructor_.call(this, i, a);
        } }]);
      }(Cs), wl = function() {
        return h(function o() {
          u(this, o), o.constructor_.apply(this, arguments);
        }, [{ key: "setVisited", value: function(o) {
          this._isVisited = o;
        } }, { key: "setInResult", value: function(o) {
          this._isInResult = o;
        } }, { key: "isCovered", value: function() {
          return this._isCovered;
        } }, { key: "isCoveredSet", value: function() {
          return this._isCoveredSet;
        } }, { key: "setLabel", value: function(o) {
          this._label = o;
        } }, { key: "getLabel", value: function() {
          return this._label;
        } }, { key: "setCovered", value: function(o) {
          this._isCovered = o, this._isCoveredSet = !0;
        } }, { key: "updateIM", value: function(o) {
          se.isTrue(this._label.getGeometryCount() >= 2, "found partial label"), this.computeIM(o);
        } }, { key: "isInResult", value: function() {
          return this._isInResult;
        } }, { key: "isVisited", value: function() {
          return this._isVisited;
        } }], [{ key: "constructor_", value: function() {
          if (this._label = null, this._isInResult = !1, this._isCovered = !1, this._isCoveredSet = !1, this._isVisited = !1, arguments.length !== 0) {
            if (arguments.length === 1) {
              var o = arguments[0];
              this._label = o;
            }
          }
        } }]);
      }(), As = function(o) {
        function t() {
          var i;
          return u(this, t), i = s(this, t), t.constructor_.apply(i, arguments), i;
        }
        return _(t, o), h(t, [{ key: "isIncidentEdgeInResult", value: function() {
          for (var i = this.getEdges().getEdges().iterator(); i.hasNext(); )
            if (i.next().getEdge().isInResult()) return !0;
          return !1;
        } }, { key: "isIsolated", value: function() {
          return this._label.getGeometryCount() === 1;
        } }, { key: "getCoordinate", value: function() {
          return this._coord;
        } }, { key: "print", value: function(i) {
          i.println("node " + this._coord + " lbl: " + this._label);
        } }, { key: "computeIM", value: function(i) {
        } }, { key: "computeMergedLocation", value: function(i, a) {
          var l = C.NONE;
          if (l = this._label.getLocation(a), !i.isNull(a)) {
            var g = i.getLocation(a);
            l !== C.BOUNDARY && (l = g);
          }
          return l;
        } }, { key: "setLabel", value: function() {
          if (arguments.length !== 2 || !Number.isInteger(arguments[1]) || !Number.isInteger(arguments[0])) return I(t, "setLabel", this, 1).apply(this, arguments);
          var i = arguments[0], a = arguments[1];
          this._label === null ? this._label = new Ut(i, a) : this._label.setLocation(i, a);
        } }, { key: "getEdges", value: function() {
          return this._edges;
        } }, { key: "mergeLabel", value: function() {
          if (arguments[0] instanceof t) {
            var i = arguments[0];
            this.mergeLabel(i._label);
          } else if (arguments[0] instanceof Ut) for (var a = arguments[0], l = 0; l < 2; l++) {
            var g = this.computeMergedLocation(a, l);
            this._label.getLocation(l) === C.NONE && this._label.setLocation(l, g);
          }
        } }, { key: "add", value: function(i) {
          this._edges.insert(i), i.setNode(this);
        } }, { key: "setLabelBoundary", value: function(i) {
          if (this._label === null) return null;
          var a = C.NONE;
          this._label !== null && (a = this._label.getLocation(i));
          var l = null;
          switch (a) {
            case C.BOUNDARY:
              l = C.INTERIOR;
              break;
            case C.INTERIOR:
            default:
              l = C.BOUNDARY;
          }
          this._label.setLocation(i, l);
        } }], [{ key: "constructor_", value: function() {
          this._coord = null, this._edges = null;
          var i = arguments[0], a = arguments[1];
          this._coord = i, this._edges = a, this._label = new Ut(0, C.NONE);
        } }]);
      }(wl), qd = function(o) {
        function t() {
          return u(this, t), s(this, t, arguments);
        }
        return _(t, o), h(t);
      }(tt);
      function kl(o) {
        return o == null ? 0 : o.color;
      }
      function Ne(o) {
        return o == null ? null : o.parent;
      }
      function yn(o, t) {
        o !== null && (o.color = t);
      }
      function oo(o) {
        return o == null ? null : o.left;
      }
      function Sl(o) {
        return o == null ? null : o.right;
      }
      var Gi = function(o) {
        function t() {
          var i;
          return u(this, t), (i = s(this, t)).root_ = null, i.size_ = 0, i;
        }
        return _(t, o), h(t, [{ key: "get", value: function(i) {
          for (var a = this.root_; a !== null; ) {
            var l = i.compareTo(a.key);
            if (l < 0) a = a.left;
            else {
              if (!(l > 0)) return a.value;
              a = a.right;
            }
          }
          return null;
        } }, { key: "put", value: function(i, a) {
          if (this.root_ === null) return this.root_ = { key: i, value: a, left: null, right: null, parent: null, color: 0, getValue: function() {
            return this.value;
          }, getKey: function() {
            return this.key;
          } }, this.size_ = 1, null;
          var l, g, p = this.root_;
          do
            if (l = p, (g = i.compareTo(p.key)) < 0) p = p.left;
            else {
              if (!(g > 0)) {
                var v = p.value;
                return p.value = a, v;
              }
              p = p.right;
            }
          while (p !== null);
          var w = { key: i, left: null, right: null, value: a, parent: l, color: 0, getValue: function() {
            return this.value;
          }, getKey: function() {
            return this.key;
          } };
          return g < 0 ? l.left = w : l.right = w, this.fixAfterInsertion(w), this.size_++, null;
        } }, { key: "fixAfterInsertion", value: function(i) {
          var a;
          for (i.color = 1; i != null && i !== this.root_ && i.parent.color === 1; ) Ne(i) === oo(Ne(Ne(i))) ? kl(a = Sl(Ne(Ne(i)))) === 1 ? (yn(Ne(i), 0), yn(a, 0), yn(Ne(Ne(i)), 1), i = Ne(Ne(i))) : (i === Sl(Ne(i)) && (i = Ne(i), this.rotateLeft(i)), yn(Ne(i), 0), yn(Ne(Ne(i)), 1), this.rotateRight(Ne(Ne(i)))) : kl(a = oo(Ne(Ne(i)))) === 1 ? (yn(Ne(i), 0), yn(a, 0), yn(Ne(Ne(i)), 1), i = Ne(Ne(i))) : (i === oo(Ne(i)) && (i = Ne(i), this.rotateRight(i)), yn(Ne(i), 0), yn(Ne(Ne(i)), 1), this.rotateLeft(Ne(Ne(i))));
          this.root_.color = 0;
        } }, { key: "values", value: function() {
          var i = new me(), a = this.getFirstEntry();
          if (a !== null) for (i.add(a.value); (a = t.successor(a)) !== null; ) i.add(a.value);
          return i;
        } }, { key: "entrySet", value: function() {
          var i = new pn(), a = this.getFirstEntry();
          if (a !== null) for (i.add(a); (a = t.successor(a)) !== null; ) i.add(a);
          return i;
        } }, { key: "rotateLeft", value: function(i) {
          if (i != null) {
            var a = i.right;
            i.right = a.left, a.left != null && (a.left.parent = i), a.parent = i.parent, i.parent == null ? this.root_ = a : i.parent.left === i ? i.parent.left = a : i.parent.right = a, a.left = i, i.parent = a;
          }
        } }, { key: "rotateRight", value: function(i) {
          if (i != null) {
            var a = i.left;
            i.left = a.right, a.right != null && (a.right.parent = i), a.parent = i.parent, i.parent == null ? this.root_ = a : i.parent.right === i ? i.parent.right = a : i.parent.left = a, a.right = i, i.parent = a;
          }
        } }, { key: "getFirstEntry", value: function() {
          var i = this.root_;
          if (i != null) for (; i.left != null; ) i = i.left;
          return i;
        } }, { key: "size", value: function() {
          return this.size_;
        } }, { key: "containsKey", value: function(i) {
          for (var a = this.root_; a !== null; ) {
            var l = i.compareTo(a.key);
            if (l < 0) a = a.left;
            else {
              if (!(l > 0)) return !0;
              a = a.right;
            }
          }
          return !1;
        } }], [{ key: "successor", value: function(i) {
          var a;
          if (i === null) return null;
          if (i.right !== null) {
            for (a = i.right; a.left !== null; ) a = a.left;
            return a;
          }
          a = i.parent;
          for (var l = i; a !== null && l === a.right; ) l = a, a = a.parent;
          return a;
        } }]);
      }(qd), Ml = function() {
        return h(function o() {
          u(this, o), o.constructor_.apply(this, arguments);
        }, [{ key: "find", value: function(o) {
          return this.nodeMap.get(o);
        } }, { key: "addNode", value: function() {
          if (arguments[0] instanceof J) {
            var o = arguments[0], t = this.nodeMap.get(o);
            return t === null && (t = this.nodeFact.createNode(o), this.nodeMap.put(o, t)), t;
          }
          if (arguments[0] instanceof As) {
            var i = arguments[0], a = this.nodeMap.get(i.getCoordinate());
            return a === null ? (this.nodeMap.put(i.getCoordinate(), i), i) : (a.mergeLabel(i), a);
          }
        } }, { key: "print", value: function(o) {
          for (var t = this.iterator(); t.hasNext(); )
            t.next().print(o);
        } }, { key: "iterator", value: function() {
          return this.nodeMap.values().iterator();
        } }, { key: "values", value: function() {
          return this.nodeMap.values();
        } }, { key: "getBoundaryNodes", value: function(o) {
          for (var t = new me(), i = this.iterator(); i.hasNext(); ) {
            var a = i.next();
            a.getLabel().getLocation(o) === C.BOUNDARY && t.add(a);
          }
          return t;
        } }, { key: "add", value: function(o) {
          var t = o.getCoordinate();
          this.addNode(t).add(o);
        } }], [{ key: "constructor_", value: function() {
          this.nodeMap = new Gi(), this.nodeFact = null;
          var o = arguments[0];
          this.nodeFact = o;
        } }]);
      }(), gt = function() {
        function o() {
          u(this, o);
        }
        return h(o, null, [{ key: "isNorthern", value: function(t) {
          return t === o.NE || t === o.NW;
        } }, { key: "isOpposite", value: function(t, i) {
          return t !== i && (t - i + 4) % 4 === 2;
        } }, { key: "commonHalfPlane", value: function(t, i) {
          if (t === i) return t;
          if ((t - i + 4) % 4 === 2) return -1;
          var a = t < i ? t : i;
          return a === 0 && (t > i ? t : i) === 3 ? 3 : a;
        } }, { key: "isInHalfPlane", value: function(t, i) {
          return i === o.SE ? t === o.SE || t === o.SW : t === i || t === i + 1;
        } }, { key: "quadrant", value: function() {
          if (typeof arguments[0] == "number" && typeof arguments[1] == "number") {
            var t = arguments[0], i = arguments[1];
            if (t === 0 && i === 0) throw new X("Cannot compute the quadrant for point ( " + t + ", " + i + " )");
            return t >= 0 ? i >= 0 ? o.NE : o.SE : i >= 0 ? o.NW : o.SW;
          }
          if (arguments[0] instanceof J && arguments[1] instanceof J) {
            var a = arguments[0], l = arguments[1];
            if (l.x === a.x && l.y === a.y) throw new X("Cannot compute the quadrant for two identical points " + a);
            return l.x >= a.x ? l.y >= a.y ? o.NE : o.SE : l.y >= a.y ? o.NW : o.SW;
          }
        } }]);
      }();
      gt.NE = 0, gt.NW = 1, gt.SW = 2, gt.SE = 3;
      var Il = function() {
        function o() {
          u(this, o), o.constructor_.apply(this, arguments);
        }
        return h(o, [{ key: "compareDirection", value: function(t) {
          return this._dx === t._dx && this._dy === t._dy ? 0 : this._quadrant > t._quadrant ? 1 : this._quadrant < t._quadrant ? -1 : _e.index(t._p0, t._p1, this._p1);
        } }, { key: "getDy", value: function() {
          return this._dy;
        } }, { key: "getCoordinate", value: function() {
          return this._p0;
        } }, { key: "setNode", value: function(t) {
          this._node = t;
        } }, { key: "print", value: function(t) {
          var i = Math.atan2(this._dy, this._dx), a = this.getClass().getName(), l = a.lastIndexOf("."), g = a.substring(l + 1);
          t.print("  " + g + ": " + this._p0 + " - " + this._p1 + " " + this._quadrant + ":" + i + "   " + this._label);
        } }, { key: "compareTo", value: function(t) {
          var i = t;
          return this.compareDirection(i);
        } }, { key: "getDirectedCoordinate", value: function() {
          return this._p1;
        } }, { key: "getDx", value: function() {
          return this._dx;
        } }, { key: "getLabel", value: function() {
          return this._label;
        } }, { key: "getEdge", value: function() {
          return this._edge;
        } }, { key: "getQuadrant", value: function() {
          return this._quadrant;
        } }, { key: "getNode", value: function() {
          return this._node;
        } }, { key: "toString", value: function() {
          var t = Math.atan2(this._dy, this._dx), i = this.getClass().getName(), a = i.lastIndexOf(".");
          return "  " + i.substring(a + 1) + ": " + this._p0 + " - " + this._p1 + " " + this._quadrant + ":" + t + "   " + this._label;
        } }, { key: "computeLabel", value: function(t) {
        } }, { key: "init", value: function(t, i) {
          this._p0 = t, this._p1 = i, this._dx = i.x - t.x, this._dy = i.y - t.y, this._quadrant = gt.quadrant(this._dx, this._dy), se.isTrue(!(this._dx === 0 && this._dy === 0), "EdgeEnd with identical endpoints found");
        } }, { key: "interfaces_", get: function() {
          return [$];
        } }], [{ key: "constructor_", value: function() {
          if (this._edge = null, this._label = null, this._node = null, this._p0 = null, this._p1 = null, this._dx = null, this._dy = null, this._quadrant = null, arguments.length === 1) {
            var t = arguments[0];
            this._edge = t;
          } else if (arguments.length === 3) {
            var i = arguments[0], a = arguments[1], l = arguments[2];
            o.constructor_.call(this, i, a, l, null);
          } else if (arguments.length === 4) {
            var g = arguments[0], p = arguments[1], v = arguments[2], w = arguments[3];
            o.constructor_.call(this, g), this.init(p, v), this._label = w;
          }
        } }]);
      }(), uo = function(o) {
        function t() {
          var i;
          return u(this, t), i = s(this, t), t.constructor_.apply(i, arguments), i;
        }
        return _(t, o), h(t, [{ key: "getNextMin", value: function() {
          return this._nextMin;
        } }, { key: "getDepth", value: function(i) {
          return this._depth[i];
        } }, { key: "setVisited", value: function(i) {
          this._isVisited = i;
        } }, { key: "computeDirectedLabel", value: function() {
          this._label = new Ut(this._edge.getLabel()), this._isForward || this._label.flip();
        } }, { key: "getNext", value: function() {
          return this._next;
        } }, { key: "setDepth", value: function(i, a) {
          if (this._depth[i] !== -999 && this._depth[i] !== a) throw new xt("assigned depths do not match", this.getCoordinate());
          this._depth[i] = a;
        } }, { key: "isInteriorAreaEdge", value: function() {
          for (var i = !0, a = 0; a < 2; a++) this._label.isArea(a) && this._label.getLocation(a, ne.LEFT) === C.INTERIOR && this._label.getLocation(a, ne.RIGHT) === C.INTERIOR || (i = !1);
          return i;
        } }, { key: "setNextMin", value: function(i) {
          this._nextMin = i;
        } }, { key: "print", value: function(i) {
          I(t, "print", this, 1).call(this, i), i.print(" " + this._depth[ne.LEFT] + "/" + this._depth[ne.RIGHT]), i.print(" (" + this.getDepthDelta() + ")"), this._isInResult && i.print(" inResult");
        } }, { key: "setMinEdgeRing", value: function(i) {
          this._minEdgeRing = i;
        } }, { key: "isLineEdge", value: function() {
          var i = this._label.isLine(0) || this._label.isLine(1), a = !this._label.isArea(0) || this._label.allPositionsEqual(0, C.EXTERIOR), l = !this._label.isArea(1) || this._label.allPositionsEqual(1, C.EXTERIOR);
          return i && a && l;
        } }, { key: "setEdgeRing", value: function(i) {
          this._edgeRing = i;
        } }, { key: "getMinEdgeRing", value: function() {
          return this._minEdgeRing;
        } }, { key: "getDepthDelta", value: function() {
          var i = this._edge.getDepthDelta();
          return this._isForward || (i = -i), i;
        } }, { key: "setInResult", value: function(i) {
          this._isInResult = i;
        } }, { key: "getSym", value: function() {
          return this._sym;
        } }, { key: "isForward", value: function() {
          return this._isForward;
        } }, { key: "getEdge", value: function() {
          return this._edge;
        } }, { key: "printEdge", value: function(i) {
          this.print(i), i.print(" "), this._isForward ? this._edge.print(i) : this._edge.printReverse(i);
        } }, { key: "setSym", value: function(i) {
          this._sym = i;
        } }, { key: "setVisitedEdge", value: function(i) {
          this.setVisited(i), this._sym.setVisited(i);
        } }, { key: "setEdgeDepths", value: function(i, a) {
          var l = this.getEdge().getDepthDelta();
          this._isForward || (l = -l);
          var g = 1;
          i === ne.LEFT && (g = -1);
          var p = ne.opposite(i), v = a + l * g;
          this.setDepth(i, a), this.setDepth(p, v);
        } }, { key: "getEdgeRing", value: function() {
          return this._edgeRing;
        } }, { key: "isInResult", value: function() {
          return this._isInResult;
        } }, { key: "setNext", value: function(i) {
          this._next = i;
        } }, { key: "isVisited", value: function() {
          return this._isVisited;
        } }], [{ key: "constructor_", value: function() {
          this._isForward = null, this._isInResult = !1, this._isVisited = !1, this._sym = null, this._next = null, this._nextMin = null, this._edgeRing = null, this._minEdgeRing = null, this._depth = [0, -999, -999];
          var i = arguments[0], a = arguments[1];
          if (Il.constructor_.call(this, i), this._isForward = a, a) this.init(i.getCoordinate(0), i.getCoordinate(1));
          else {
            var l = i.getNumPoints() - 1;
            this.init(i.getCoordinate(l), i.getCoordinate(l - 1));
          }
          this.computeDirectedLabel();
        } }, { key: "depthFactor", value: function(i, a) {
          return i === C.EXTERIOR && a === C.INTERIOR ? 1 : i === C.INTERIOR && a === C.EXTERIOR ? -1 : 0;
        } }]);
      }(Il), bl = function() {
        return h(function o() {
          u(this, o);
        }, [{ key: "createNode", value: function(o) {
          return new As(o, null);
        } }]);
      }(), Tl = function() {
        return h(function o() {
          u(this, o), o.constructor_.apply(this, arguments);
        }, [{ key: "printEdges", value: function(o) {
          o.println("Edges:");
          for (var t = 0; t < this._edges.size(); t++) {
            o.println("edge " + t + ":");
            var i = this._edges.get(t);
            i.print(o), i.eiList.print(o);
          }
        } }, { key: "find", value: function(o) {
          return this._nodes.find(o);
        } }, { key: "addNode", value: function() {
          if (arguments[0] instanceof As) {
            var o = arguments[0];
            return this._nodes.addNode(o);
          }
          if (arguments[0] instanceof J) {
            var t = arguments[0];
            return this._nodes.addNode(t);
          }
        } }, { key: "getNodeIterator", value: function() {
          return this._nodes.iterator();
        } }, { key: "linkResultDirectedEdges", value: function() {
          for (var o = this._nodes.iterator(); o.hasNext(); )
            o.next().getEdges().linkResultDirectedEdges();
        } }, { key: "debugPrintln", value: function(o) {
          at.out.println(o);
        } }, { key: "isBoundaryNode", value: function(o, t) {
          var i = this._nodes.find(t);
          if (i === null) return !1;
          var a = i.getLabel();
          return a !== null && a.getLocation(o) === C.BOUNDARY;
        } }, { key: "linkAllDirectedEdges", value: function() {
          for (var o = this._nodes.iterator(); o.hasNext(); )
            o.next().getEdges().linkAllDirectedEdges();
        } }, { key: "matchInSameDirection", value: function(o, t, i, a) {
          return !!o.equals(i) && _e.index(o, t, a) === _e.COLLINEAR && gt.quadrant(o, t) === gt.quadrant(i, a);
        } }, { key: "getEdgeEnds", value: function() {
          return this._edgeEndList;
        } }, { key: "debugPrint", value: function(o) {
          at.out.print(o);
        } }, { key: "getEdgeIterator", value: function() {
          return this._edges.iterator();
        } }, { key: "findEdgeInSameDirection", value: function(o, t) {
          for (var i = 0; i < this._edges.size(); i++) {
            var a = this._edges.get(i), l = a.getCoordinates();
            if (this.matchInSameDirection(o, t, l[0], l[1]) || this.matchInSameDirection(o, t, l[l.length - 1], l[l.length - 2])) return a;
          }
          return null;
        } }, { key: "insertEdge", value: function(o) {
          this._edges.add(o);
        } }, { key: "findEdgeEnd", value: function(o) {
          for (var t = this.getEdgeEnds().iterator(); t.hasNext(); ) {
            var i = t.next();
            if (i.getEdge() === o) return i;
          }
          return null;
        } }, { key: "addEdges", value: function(o) {
          for (var t = o.iterator(); t.hasNext(); ) {
            var i = t.next();
            this._edges.add(i);
            var a = new uo(i, !0), l = new uo(i, !1);
            a.setSym(l), l.setSym(a), this.add(a), this.add(l);
          }
        } }, { key: "add", value: function(o) {
          this._nodes.add(o), this._edgeEndList.add(o);
        } }, { key: "getNodes", value: function() {
          return this._nodes.values();
        } }, { key: "findEdge", value: function(o, t) {
          for (var i = 0; i < this._edges.size(); i++) {
            var a = this._edges.get(i), l = a.getCoordinates();
            if (o.equals(l[0]) && t.equals(l[1])) return a;
          }
          return null;
        } }], [{ key: "constructor_", value: function() {
          if (this._edges = new me(), this._nodes = null, this._edgeEndList = new me(), arguments.length === 0) this._nodes = new Ml(new bl());
          else if (arguments.length === 1) {
            var o = arguments[0];
            this._nodes = new Ml(o);
          }
        } }, { key: "linkResultDirectedEdges", value: function(o) {
          for (var t = o.iterator(); t.hasNext(); )
            t.next().getEdges().linkResultDirectedEdges();
        } }]);
      }(), Yd = function() {
        function o() {
          u(this, o), o.constructor_.apply(this, arguments);
        }
        return h(o, [{ key: "sortShellsAndHoles", value: function(t, i, a) {
          for (var l = t.iterator(); l.hasNext(); ) {
            var g = l.next();
            g.isHole() ? a.add(g) : i.add(g);
          }
        } }, { key: "computePolygons", value: function(t) {
          for (var i = new me(), a = t.iterator(); a.hasNext(); ) {
            var l = a.next().toPolygon(this._geometryFactory);
            i.add(l);
          }
          return i;
        } }, { key: "placeFreeHoles", value: function(t, i) {
          for (var a = i.iterator(); a.hasNext(); ) {
            var l = a.next();
            if (l.getShell() === null) {
              var g = o.findEdgeRingContaining(l, t);
              if (g === null) throw new xt("unable to assign hole to a shell", l.getCoordinate(0));
              l.setShell(g);
            }
          }
        } }, { key: "buildMinimalEdgeRings", value: function(t, i, a) {
          for (var l = new me(), g = t.iterator(); g.hasNext(); ) {
            var p = g.next();
            if (p.getMaxNodeDegree() > 2) {
              p.linkDirectedEdgesForMinimalEdgeRings();
              var v = p.buildMinimalRings(), w = this.findShell(v);
              w !== null ? (this.placePolygonHoles(w, v), i.add(w)) : a.addAll(v);
            } else l.add(p);
          }
          return l;
        } }, { key: "buildMaximalEdgeRings", value: function(t) {
          for (var i = new me(), a = t.iterator(); a.hasNext(); ) {
            var l = a.next();
            if (l.isInResult() && l.getLabel().isArea() && l.getEdgeRing() === null) {
              var g = new zd(l, this._geometryFactory);
              i.add(g), g.setInResult();
            }
          }
          return i;
        } }, { key: "placePolygonHoles", value: function(t, i) {
          for (var a = i.iterator(); a.hasNext(); ) {
            var l = a.next();
            l.isHole() && l.setShell(t);
          }
        } }, { key: "getPolygons", value: function() {
          return this.computePolygons(this._shellList);
        } }, { key: "findShell", value: function(t) {
          for (var i = 0, a = null, l = t.iterator(); l.hasNext(); ) {
            var g = l.next();
            g.isHole() || (a = g, i++);
          }
          return se.isTrue(i <= 1, "found two shells in MinimalEdgeRing list"), a;
        } }, { key: "add", value: function() {
          if (arguments.length === 1) {
            var t = arguments[0];
            this.add(t.getEdgeEnds(), t.getNodes());
          } else if (arguments.length === 2) {
            var i = arguments[0], a = arguments[1];
            Tl.linkResultDirectedEdges(a);
            var l = this.buildMaximalEdgeRings(i), g = new me(), p = this.buildMinimalEdgeRings(l, this._shellList, g);
            this.sortShellsAndHoles(p, this._shellList, g), this.placeFreeHoles(this._shellList, g);
          }
        } }], [{ key: "constructor_", value: function() {
          this._geometryFactory = null, this._shellList = new me();
          var t = arguments[0];
          this._geometryFactory = t;
        } }, { key: "findEdgeRingContaining", value: function(t, i) {
          for (var a = t.getLinearRing(), l = a.getEnvelopeInternal(), g = a.getCoordinateN(0), p = null, v = null, w = i.iterator(); w.hasNext(); ) {
            var b = w.next(), z = b.getLinearRing(), W = z.getEnvelopeInternal();
            if (!W.equals(l) && W.contains(l)) {
              g = oe.ptNotInList(a.getCoordinates(), z.getCoordinates());
              var Q = !1;
              ao.isInRing(g, z.getCoordinates()) && (Q = !0), Q && (p === null || v.contains(W)) && (v = (p = b).getLinearRing().getEnvelopeInternal());
            }
          }
          return p;
        } }]);
      }(), Ll = function() {
        return h(function o() {
          u(this, o);
        }, [{ key: "getBounds", value: function() {
        } }]);
      }(), Dn = function() {
        return h(function o() {
          u(this, o), o.constructor_.apply(this, arguments);
        }, [{ key: "getItem", value: function() {
          return this._item;
        } }, { key: "getBounds", value: function() {
          return this._bounds;
        } }, { key: "interfaces_", get: function() {
          return [Ll, k];
        } }], [{ key: "constructor_", value: function() {
          this._bounds = null, this._item = null;
          var o = arguments[0], t = arguments[1];
          this._bounds = o, this._item = t;
        } }]);
      }(), Ns = function() {
        return h(function o() {
          u(this, o), o.constructor_.apply(this, arguments);
        }, [{ key: "poll", value: function() {
          if (this.isEmpty()) return null;
          var o = this._items.get(1);
          return this._items.set(1, this._items.get(this._size)), this._size -= 1, this.reorder(1), o;
        } }, { key: "size", value: function() {
          return this._size;
        } }, { key: "reorder", value: function(o) {
          for (var t = null, i = this._items.get(o); 2 * o <= this._size && ((t = 2 * o) !== this._size && this._items.get(t + 1).compareTo(this._items.get(t)) < 0 && t++, this._items.get(t).compareTo(i) < 0); o = t) this._items.set(o, this._items.get(t));
          this._items.set(o, i);
        } }, { key: "clear", value: function() {
          this._size = 0, this._items.clear();
        } }, { key: "peek", value: function() {
          return this.isEmpty() ? null : this._items.get(1);
        } }, { key: "isEmpty", value: function() {
          return this._size === 0;
        } }, { key: "add", value: function(o) {
          this._items.add(null), this._size += 1;
          var t = this._size;
          for (this._items.set(0, o); o.compareTo(this._items.get(Math.trunc(t / 2))) < 0; t /= 2) this._items.set(t, this._items.get(Math.trunc(t / 2)));
          this._items.set(t, o);
        } }], [{ key: "constructor_", value: function() {
          this._size = null, this._items = null, this._size = 0, this._items = new me(), this._items.add(null);
        } }]);
      }(), Hd = function() {
        return h(function o() {
          u(this, o);
        }, [{ key: "insert", value: function(o, t) {
        } }, { key: "remove", value: function(o, t) {
        } }, { key: "query", value: function() {
        } }]);
      }(), zt = function() {
        return h(function o() {
          u(this, o), o.constructor_.apply(this, arguments);
        }, [{ key: "getLevel", value: function() {
          return this._level;
        } }, { key: "size", value: function() {
          return this._childBoundables.size();
        } }, { key: "getChildBoundables", value: function() {
          return this._childBoundables;
        } }, { key: "addChildBoundable", value: function(o) {
          se.isTrue(this._bounds === null), this._childBoundables.add(o);
        } }, { key: "isEmpty", value: function() {
          return this._childBoundables.isEmpty();
        } }, { key: "getBounds", value: function() {
          return this._bounds === null && (this._bounds = this.computeBounds()), this._bounds;
        } }, { key: "interfaces_", get: function() {
          return [Ll, k];
        } }], [{ key: "constructor_", value: function() {
          if (this._childBoundables = new me(), this._bounds = null, this._level = null, arguments.length !== 0) {
            if (arguments.length === 1) {
              var o = arguments[0];
              this._level = o;
            }
          }
        } }]);
      }(), Jr = { reverseOrder: function() {
        return { compare: function(o, t) {
          return t.compareTo(o);
        } };
      }, min: function(o) {
        return Jr.sort(o), o.get(0);
      }, sort: function(o, t) {
        var i = o.toArray();
        t ? Gt.sort(i, t) : Gt.sort(i);
        for (var a = o.iterator(), l = 0, g = i.length; l < g; l++) a.next(), a.set(i[l]);
      }, singletonList: function(o) {
        var t = new me();
        return t.add(o), t;
      } }, Jd = function() {
        function o() {
          u(this, o);
        }
        return h(o, null, [{ key: "maxDistance", value: function(t, i, a, l, g, p, v, w) {
          var b = o.distance(t, i, g, p);
          return b = Math.max(b, o.distance(t, i, v, w)), b = Math.max(b, o.distance(a, l, g, p)), b = Math.max(b, o.distance(a, l, v, w));
        } }, { key: "distance", value: function(t, i, a, l) {
          var g = a - t, p = l - i;
          return Math.sqrt(g * g + p * p);
        } }, { key: "maximumDistance", value: function(t, i) {
          var a = Math.min(t.getMinX(), i.getMinX()), l = Math.min(t.getMinY(), i.getMinY()), g = Math.max(t.getMaxX(), i.getMaxX()), p = Math.max(t.getMaxY(), i.getMaxY());
          return o.distance(a, l, g, p);
        } }, { key: "minMaxDistance", value: function(t, i) {
          var a = t.getMinX(), l = t.getMinY(), g = t.getMaxX(), p = t.getMaxY(), v = i.getMinX(), w = i.getMinY(), b = i.getMaxX(), z = i.getMaxY(), W = o.maxDistance(a, l, a, p, v, w, v, z);
          return W = Math.min(W, o.maxDistance(a, l, a, p, v, w, b, w)), W = Math.min(W, o.maxDistance(a, l, a, p, b, z, v, z)), W = Math.min(W, o.maxDistance(a, l, a, p, b, z, b, w)), W = Math.min(W, o.maxDistance(a, l, g, l, v, w, v, z)), W = Math.min(W, o.maxDistance(a, l, g, l, v, w, b, w)), W = Math.min(W, o.maxDistance(a, l, g, l, b, z, v, z)), W = Math.min(W, o.maxDistance(a, l, g, l, b, z, b, w)), W = Math.min(W, o.maxDistance(g, p, a, p, v, w, v, z)), W = Math.min(W, o.maxDistance(g, p, a, p, v, w, b, w)), W = Math.min(W, o.maxDistance(g, p, a, p, b, z, v, z)), W = Math.min(W, o.maxDistance(g, p, a, p, b, z, b, w)), W = Math.min(W, o.maxDistance(g, p, g, l, v, w, v, z)), W = Math.min(W, o.maxDistance(g, p, g, l, v, w, b, w)), W = Math.min(W, o.maxDistance(g, p, g, l, b, z, v, z)), W = Math.min(W, o.maxDistance(g, p, g, l, b, z, b, w));
        } }]);
      }(), Vr = function() {
        function o() {
          u(this, o), o.constructor_.apply(this, arguments);
        }
        return h(o, [{ key: "maximumDistance", value: function() {
          return Jd.maximumDistance(this._boundable1.getBounds(), this._boundable2.getBounds());
        } }, { key: "expandToQueue", value: function(t, i) {
          var a = o.isComposite(this._boundable1), l = o.isComposite(this._boundable2);
          if (a && l) return o.area(this._boundable1) > o.area(this._boundable2) ? (this.expand(this._boundable1, this._boundable2, !1, t, i), null) : (this.expand(this._boundable2, this._boundable1, !0, t, i), null);
          if (a) return this.expand(this._boundable1, this._boundable2, !1, t, i), null;
          if (l) return this.expand(this._boundable2, this._boundable1, !0, t, i), null;
          throw new X("neither boundable is composite");
        } }, { key: "isLeaves", value: function() {
          return !(o.isComposite(this._boundable1) || o.isComposite(this._boundable2));
        } }, { key: "compareTo", value: function(t) {
          var i = t;
          return this._distance < i._distance ? -1 : this._distance > i._distance ? 1 : 0;
        } }, { key: "expand", value: function(t, i, a, l, g) {
          for (var p = t.getChildBoundables().iterator(); p.hasNext(); ) {
            var v = p.next(), w = null;
            (w = a ? new o(i, v, this._itemDistance) : new o(v, i, this._itemDistance)).getDistance() < g && l.add(w);
          }
        } }, { key: "getBoundable", value: function(t) {
          return t === 0 ? this._boundable1 : this._boundable2;
        } }, { key: "getDistance", value: function() {
          return this._distance;
        } }, { key: "distance", value: function() {
          return this.isLeaves() ? this._itemDistance.distance(this._boundable1, this._boundable2) : this._boundable1.getBounds().distance(this._boundable2.getBounds());
        } }, { key: "interfaces_", get: function() {
          return [$];
        } }], [{ key: "constructor_", value: function() {
          this._boundable1 = null, this._boundable2 = null, this._distance = null, this._itemDistance = null;
          var t = arguments[0], i = arguments[1], a = arguments[2];
          this._boundable1 = t, this._boundable2 = i, this._itemDistance = a, this._distance = this.distance();
        } }, { key: "area", value: function(t) {
          return t.getBounds().getArea();
        } }, { key: "isComposite", value: function(t) {
          return t instanceof zt;
        } }]);
      }(), Cl = function() {
        return h(function o() {
          u(this, o);
        }, [{ key: "visitItem", value: function(o) {
        } }]);
      }(), Xr = function() {
        function o() {
          u(this, o), o.constructor_.apply(this, arguments);
        }
        return h(o, [{ key: "queryInternal", value: function() {
          if (Ee(arguments[2], Cl) && arguments[0] instanceof Object && arguments[1] instanceof zt) for (var t = arguments[0], i = arguments[2], a = arguments[1].getChildBoundables(), l = 0; l < a.size(); l++) {
            var g = a.get(l);
            this.getIntersectsOp().intersects(g.getBounds(), t) && (g instanceof zt ? this.queryInternal(t, g, i) : g instanceof Dn ? i.visitItem(g.getItem()) : se.shouldNeverReachHere());
          }
          else if (Ee(arguments[2], Nn) && arguments[0] instanceof Object && arguments[1] instanceof zt) for (var p = arguments[0], v = arguments[2], w = arguments[1].getChildBoundables(), b = 0; b < w.size(); b++) {
            var z = w.get(b);
            this.getIntersectsOp().intersects(z.getBounds(), p) && (z instanceof zt ? this.queryInternal(p, z, v) : z instanceof Dn ? v.add(z.getItem()) : se.shouldNeverReachHere());
          }
        } }, { key: "getNodeCapacity", value: function() {
          return this._nodeCapacity;
        } }, { key: "lastNode", value: function(t) {
          return t.get(t.size() - 1);
        } }, { key: "size", value: function() {
          if (arguments.length === 0) return this.isEmpty() ? 0 : (this.build(), this.size(this._root));
          if (arguments.length === 1) {
            for (var t = 0, i = arguments[0].getChildBoundables().iterator(); i.hasNext(); ) {
              var a = i.next();
              a instanceof zt ? t += this.size(a) : a instanceof Dn && (t += 1);
            }
            return t;
          }
        } }, { key: "removeItem", value: function(t, i) {
          for (var a = null, l = t.getChildBoundables().iterator(); l.hasNext(); ) {
            var g = l.next();
            g instanceof Dn && g.getItem() === i && (a = g);
          }
          return a !== null && (t.getChildBoundables().remove(a), !0);
        } }, { key: "itemsTree", value: function() {
          if (arguments.length === 0) {
            this.build();
            var t = this.itemsTree(this._root);
            return t === null ? new me() : t;
          }
          if (arguments.length === 1) {
            for (var i = arguments[0], a = new me(), l = i.getChildBoundables().iterator(); l.hasNext(); ) {
              var g = l.next();
              if (g instanceof zt) {
                var p = this.itemsTree(g);
                p !== null && a.add(p);
              } else g instanceof Dn ? a.add(g.getItem()) : se.shouldNeverReachHere();
            }
            return a.size() <= 0 ? null : a;
          }
        } }, { key: "insert", value: function(t, i) {
          se.isTrue(!this._built, "Cannot insert items into an STR packed R-tree after it has been built."), this._itemBoundables.add(new Dn(t, i));
        } }, { key: "boundablesAtLevel", value: function() {
          if (arguments.length === 1) {
            var t = arguments[0], i = new me();
            return this.boundablesAtLevel(t, this._root, i), i;
          }
          if (arguments.length === 3) {
            var a = arguments[0], l = arguments[1], g = arguments[2];
            if (se.isTrue(a > -2), l.getLevel() === a) return g.add(l), null;
            for (var p = l.getChildBoundables().iterator(); p.hasNext(); ) {
              var v = p.next();
              v instanceof zt ? this.boundablesAtLevel(a, v, g) : (se.isTrue(v instanceof Dn), a === -1 && g.add(v));
            }
            return null;
          }
        } }, { key: "query", value: function() {
          if (arguments.length === 1) {
            var t = arguments[0];
            this.build();
            var i = new me();
            return this.isEmpty() || this.getIntersectsOp().intersects(this._root.getBounds(), t) && this.queryInternal(t, this._root, i), i;
          }
          if (arguments.length === 2) {
            var a = arguments[0], l = arguments[1];
            if (this.build(), this.isEmpty()) return null;
            this.getIntersectsOp().intersects(this._root.getBounds(), a) && this.queryInternal(a, this._root, l);
          }
        } }, { key: "build", value: function() {
          if (this._built) return null;
          this._root = this._itemBoundables.isEmpty() ? this.createNode(0) : this.createHigherLevels(this._itemBoundables, -1), this._itemBoundables = null, this._built = !0;
        } }, { key: "getRoot", value: function() {
          return this.build(), this._root;
        } }, { key: "remove", value: function() {
          if (arguments.length === 2) {
            var t = arguments[0], i = arguments[1];
            return this.build(), !!this.getIntersectsOp().intersects(this._root.getBounds(), t) && this.remove(t, this._root, i);
          }
          if (arguments.length === 3) {
            var a = arguments[0], l = arguments[1], g = arguments[2], p = this.removeItem(l, g);
            if (p) return !0;
            for (var v = null, w = l.getChildBoundables().iterator(); w.hasNext(); ) {
              var b = w.next();
              if (this.getIntersectsOp().intersects(b.getBounds(), a) && b instanceof zt && (p = this.remove(a, b, g))) {
                v = b;
                break;
              }
            }
            return v !== null && v.getChildBoundables().isEmpty() && l.getChildBoundables().remove(v), p;
          }
        } }, { key: "createHigherLevels", value: function(t, i) {
          se.isTrue(!t.isEmpty());
          var a = this.createParentBoundables(t, i + 1);
          return a.size() === 1 ? a.get(0) : this.createHigherLevels(a, i + 1);
        } }, { key: "depth", value: function() {
          if (arguments.length === 0) return this.isEmpty() ? 0 : (this.build(), this.depth(this._root));
          if (arguments.length === 1) {
            for (var t = 0, i = arguments[0].getChildBoundables().iterator(); i.hasNext(); ) {
              var a = i.next();
              if (a instanceof zt) {
                var l = this.depth(a);
                l > t && (t = l);
              }
            }
            return t + 1;
          }
        } }, { key: "createParentBoundables", value: function(t, i) {
          se.isTrue(!t.isEmpty());
          var a = new me();
          a.add(this.createNode(i));
          var l = new me(t);
          Jr.sort(l, this.getComparator());
          for (var g = l.iterator(); g.hasNext(); ) {
            var p = g.next();
            this.lastNode(a).getChildBoundables().size() === this.getNodeCapacity() && a.add(this.createNode(i)), this.lastNode(a).addChildBoundable(p);
          }
          return a;
        } }, { key: "isEmpty", value: function() {
          return this._built ? this._root.isEmpty() : this._itemBoundables.isEmpty();
        } }, { key: "interfaces_", get: function() {
          return [k];
        } }], [{ key: "constructor_", value: function() {
          if (this._root = null, this._built = !1, this._itemBoundables = new me(), this._nodeCapacity = null, arguments.length === 0) o.constructor_.call(this, o.DEFAULT_NODE_CAPACITY);
          else if (arguments.length === 1) {
            var t = arguments[0];
            se.isTrue(t > 1, "Node capacity must be greater than 1"), this._nodeCapacity = t;
          }
        } }, { key: "compareDoubles", value: function(t, i) {
          return t > i ? 1 : t < i ? -1 : 0;
        } }]);
      }();
      Xr.IntersectsOp = function() {
      }, Xr.DEFAULT_NODE_CAPACITY = 10;
      var Vd = function() {
        return h(function o() {
          u(this, o);
        }, [{ key: "distance", value: function(o, t) {
        } }]);
      }(), _n = function(o) {
        function t() {
          var i;
          return u(this, t), i = s(this, t), t.constructor_.apply(i, arguments), i;
        }
        return _(t, o), h(t, [{ key: "createParentBoundablesFromVerticalSlices", value: function(i, a) {
          se.isTrue(i.length > 0);
          for (var l = new me(), g = 0; g < i.length; g++) l.addAll(this.createParentBoundablesFromVerticalSlice(i[g], a));
          return l;
        } }, { key: "nearestNeighbourK", value: function() {
          if (arguments.length === 2) {
            var i = arguments[0], a = arguments[1];
            return this.nearestNeighbourK(i, K.POSITIVE_INFINITY, a);
          }
          if (arguments.length === 3) {
            var l = arguments[0], g = arguments[2], p = arguments[1], v = new Ns();
            v.add(l);
            for (var w = new Ns(); !v.isEmpty() && p >= 0; ) {
              var b = v.poll(), z = b.getDistance();
              if (z >= p) break;
              b.isLeaves() ? w.size() < g ? w.add(b) : (w.peek().getDistance() > z && (w.poll(), w.add(b)), p = w.peek().getDistance()) : b.expandToQueue(v, p);
            }
            return t.getItems(w);
          }
        } }, { key: "createNode", value: function(i) {
          return new Al(i);
        } }, { key: "size", value: function() {
          return arguments.length === 0 ? I(t, "size", this, 1).call(this) : I(t, "size", this, 1).apply(this, arguments);
        } }, { key: "insert", value: function() {
          if (!(arguments.length === 2 && arguments[1] instanceof Object && arguments[0] instanceof be)) return I(t, "insert", this, 1).apply(this, arguments);
          var i = arguments[0], a = arguments[1];
          if (i.isNull()) return null;
          I(t, "insert", this, 1).call(this, i, a);
        } }, { key: "getIntersectsOp", value: function() {
          return t.intersectsOp;
        } }, { key: "verticalSlices", value: function(i, a) {
          for (var l = Math.trunc(Math.ceil(i.size() / a)), g = new Array(a).fill(null), p = i.iterator(), v = 0; v < a; v++) {
            g[v] = new me();
            for (var w = 0; p.hasNext() && w < l; ) {
              var b = p.next();
              g[v].add(b), w++;
            }
          }
          return g;
        } }, { key: "query", value: function() {
          if (arguments.length === 1) {
            var i = arguments[0];
            return I(t, "query", this, 1).call(this, i);
          }
          if (arguments.length === 2) {
            var a = arguments[0], l = arguments[1];
            I(t, "query", this, 1).call(this, a, l);
          }
        } }, { key: "getComparator", value: function() {
          return t.yComparator;
        } }, { key: "createParentBoundablesFromVerticalSlice", value: function(i, a) {
          return I(t, "createParentBoundables", this, 1).call(this, i, a);
        } }, { key: "remove", value: function() {
          if (arguments.length === 2 && arguments[1] instanceof Object && arguments[0] instanceof be) {
            var i = arguments[0], a = arguments[1];
            return I(t, "remove", this, 1).call(this, i, a);
          }
          return I(t, "remove", this, 1).apply(this, arguments);
        } }, { key: "depth", value: function() {
          return arguments.length === 0 ? I(t, "depth", this, 1).call(this) : I(t, "depth", this, 1).apply(this, arguments);
        } }, { key: "createParentBoundables", value: function(i, a) {
          se.isTrue(!i.isEmpty());
          var l = Math.trunc(Math.ceil(i.size() / this.getNodeCapacity())), g = new me(i);
          Jr.sort(g, t.xComparator);
          var p = this.verticalSlices(g, Math.trunc(Math.ceil(Math.sqrt(l))));
          return this.createParentBoundablesFromVerticalSlices(p, a);
        } }, { key: "nearestNeighbour", value: function() {
          if (arguments.length === 1) {
            if (Ee(arguments[0], Vd)) {
              var i = arguments[0];
              if (this.isEmpty()) return null;
              var a = new Vr(this.getRoot(), this.getRoot(), i);
              return this.nearestNeighbour(a);
            }
            if (arguments[0] instanceof Vr) {
              var l = arguments[0], g = K.POSITIVE_INFINITY, p = null, v = new Ns();
              for (v.add(l); !v.isEmpty() && g > 0; ) {
                var w = v.poll(), b = w.getDistance();
                if (b >= g) break;
                w.isLeaves() ? (g = b, p = w) : w.expandToQueue(v, g);
              }
              return p === null ? null : [p.getBoundable(0).getItem(), p.getBoundable(1).getItem()];
            }
          } else {
            if (arguments.length === 2) {
              var z = arguments[0], W = arguments[1];
              if (this.isEmpty() || z.isEmpty()) return null;
              var Q = new Vr(this.getRoot(), z.getRoot(), W);
              return this.nearestNeighbour(Q);
            }
            if (arguments.length === 3) {
              var le = arguments[2], fe = new Dn(arguments[0], arguments[1]), ve = new Vr(this.getRoot(), fe, le);
              return this.nearestNeighbour(ve)[0];
            }
            if (arguments.length === 4) {
              var Te = arguments[2], Ie = arguments[3], Fe = new Dn(arguments[0], arguments[1]), ot = new Vr(this.getRoot(), Fe, Te);
              return this.nearestNeighbourK(ot, Ie);
            }
          }
        } }, { key: "isWithinDistance", value: function() {
          if (arguments.length === 2) {
            var i = arguments[0], a = arguments[1], l = K.POSITIVE_INFINITY, g = new Ns();
            for (g.add(i); !g.isEmpty(); ) {
              var p = g.poll(), v = p.getDistance();
              if (v > a) return !1;
              if (p.maximumDistance() <= a) return !0;
              if (p.isLeaves()) {
                if ((l = v) <= a) return !0;
              } else p.expandToQueue(g, l);
            }
            return !1;
          }
          if (arguments.length === 3) {
            var w = arguments[0], b = arguments[1], z = arguments[2], W = new Vr(this.getRoot(), w.getRoot(), b);
            return this.isWithinDistance(W, z);
          }
        } }, { key: "interfaces_", get: function() {
          return [Hd, k];
        } }], [{ key: "constructor_", value: function() {
          if (arguments.length === 0) t.constructor_.call(this, t.DEFAULT_NODE_CAPACITY);
          else if (arguments.length === 1) {
            var i = arguments[0];
            Xr.constructor_.call(this, i);
          }
        } }, { key: "centreX", value: function(i) {
          return t.avg(i.getMinX(), i.getMaxX());
        } }, { key: "avg", value: function(i, a) {
          return (i + a) / 2;
        } }, { key: "getItems", value: function(i) {
          for (var a = new Array(i.size()).fill(null), l = 0; !i.isEmpty(); ) {
            var g = i.poll();
            a[l] = g.getBoundable(0).getItem(), l++;
          }
          return a;
        } }, { key: "centreY", value: function(i) {
          return t.avg(i.getMinY(), i.getMaxY());
        } }]);
      }(Xr), Al = function(o) {
        function t() {
          var i;
          return u(this, t), i = s(this, t), t.constructor_.apply(i, arguments), i;
        }
        return _(t, o), h(t, [{ key: "computeBounds", value: function() {
          for (var i = null, a = this.getChildBoundables().iterator(); a.hasNext(); ) {
            var l = a.next();
            i === null ? i = new be(l.getBounds()) : i.expandToInclude(l.getBounds());
          }
          return i;
        } }], [{ key: "constructor_", value: function() {
          var i = arguments[0];
          zt.constructor_.call(this, i);
        } }]);
      }(zt);
      _n.STRtreeNode = Al, _n.xComparator = new (function() {
        return h(function o() {
          u(this, o);
        }, [{ key: "interfaces_", get: function() {
          return [re];
        } }, { key: "compare", value: function(o, t) {
          return Xr.compareDoubles(_n.centreX(o.getBounds()), _n.centreX(t.getBounds()));
        } }]);
      }())(), _n.yComparator = new (function() {
        return h(function o() {
          u(this, o);
        }, [{ key: "interfaces_", get: function() {
          return [re];
        } }, { key: "compare", value: function(o, t) {
          return Xr.compareDoubles(_n.centreY(o.getBounds()), _n.centreY(t.getBounds()));
        } }]);
      }())(), _n.intersectsOp = new (function() {
        return h(function o() {
          u(this, o);
        }, [{ key: "interfaces_", get: function() {
          return [IntersectsOp];
        } }, { key: "intersects", value: function(o, t) {
          return o.intersects(t);
        } }]);
      }())(), _n.DEFAULT_NODE_CAPACITY = 10;
      var Xd = function() {
        function o() {
          u(this, o);
        }
        return h(o, null, [{ key: "relativeSign", value: function(t, i) {
          return t < i ? -1 : t > i ? 1 : 0;
        } }, { key: "compare", value: function(t, i, a) {
          if (i.equals2D(a)) return 0;
          var l = o.relativeSign(i.x, a.x), g = o.relativeSign(i.y, a.y);
          switch (t) {
            case 0:
              return o.compareValue(l, g);
            case 1:
              return o.compareValue(g, l);
            case 2:
              return o.compareValue(g, -l);
            case 3:
              return o.compareValue(-l, g);
            case 4:
              return o.compareValue(-l, -g);
            case 5:
              return o.compareValue(-g, -l);
            case 6:
              return o.compareValue(-g, l);
            case 7:
              return o.compareValue(l, -g);
          }
          return se.shouldNeverReachHere("invalid octant value"), 0;
        } }, { key: "compareValue", value: function(t, i) {
          return t < 0 ? -1 : t > 0 ? 1 : i < 0 ? -1 : i > 0 ? 1 : 0;
        } }]);
      }(), Wd = function() {
        return h(function o() {
          u(this, o), o.constructor_.apply(this, arguments);
        }, [{ key: "getCoordinate", value: function() {
          return this.coord;
        } }, { key: "print", value: function(o) {
          o.print(this.coord), o.print(" seg # = " + this.segmentIndex);
        } }, { key: "compareTo", value: function(o) {
          var t = o;
          return this.segmentIndex < t.segmentIndex ? -1 : this.segmentIndex > t.segmentIndex ? 1 : this.coord.equals2D(t.coord) ? 0 : this._isInterior ? t._isInterior ? Xd.compare(this._segmentOctant, this.coord, t.coord) : 1 : -1;
        } }, { key: "isEndPoint", value: function(o) {
          return this.segmentIndex === 0 && !this._isInterior || this.segmentIndex === o;
        } }, { key: "toString", value: function() {
          return this.segmentIndex + ":" + this.coord.toString();
        } }, { key: "isInterior", value: function() {
          return this._isInterior;
        } }, { key: "interfaces_", get: function() {
          return [$];
        } }], [{ key: "constructor_", value: function() {
          this._segString = null, this.coord = null, this.segmentIndex = null, this._segmentOctant = null, this._isInterior = null;
          var o = arguments[0], t = arguments[1], i = arguments[2], a = arguments[3];
          this._segString = o, this.coord = new J(t), this.segmentIndex = i, this._segmentOctant = a, this._isInterior = !t.equals2D(o.getCoordinate(i));
        } }]);
      }(), Zd = function() {
        return h(function o() {
          u(this, o);
        }, [{ key: "hasNext", value: function() {
        } }, { key: "next", value: function() {
        } }, { key: "remove", value: function() {
        } }]);
      }(), jd = function() {
        return h(function o() {
          u(this, o), o.constructor_.apply(this, arguments);
        }, [{ key: "getSplitCoordinates", value: function() {
          var o = new te();
          this.addEndpoints();
          for (var t = this.iterator(), i = t.next(); t.hasNext(); ) {
            var a = t.next();
            this.addEdgeCoordinates(i, a, o), i = a;
          }
          return o.toCoordinateArray();
        } }, { key: "addCollapsedNodes", value: function() {
          var o = new me();
          this.findCollapsesFromInsertedNodes(o), this.findCollapsesFromExistingVertices(o);
          for (var t = o.iterator(); t.hasNext(); ) {
            var i = t.next().intValue();
            this.add(this._edge.getCoordinate(i), i);
          }
        } }, { key: "createSplitEdgePts", value: function(o, t) {
          var i = t.segmentIndex - o.segmentIndex + 2;
          if (i === 2) return [new J(o.coord), new J(t.coord)];
          var a = this._edge.getCoordinate(t.segmentIndex), l = t.isInterior() || !t.coord.equals2D(a);
          l || i--;
          var g = new Array(i).fill(null), p = 0;
          g[p++] = new J(o.coord);
          for (var v = o.segmentIndex + 1; v <= t.segmentIndex; v++) g[p++] = this._edge.getCoordinate(v);
          return l && (g[p] = new J(t.coord)), g;
        } }, { key: "print", value: function(o) {
          o.println("Intersections:");
          for (var t = this.iterator(); t.hasNext(); )
            t.next().print(o);
        } }, { key: "findCollapsesFromExistingVertices", value: function(o) {
          for (var t = 0; t < this._edge.size() - 2; t++) {
            var i = this._edge.getCoordinate(t);
            this._edge.getCoordinate(t + 1);
            var a = this._edge.getCoordinate(t + 2);
            i.equals2D(a) && o.add(Qt.valueOf(t + 1));
          }
        } }, { key: "addEdgeCoordinates", value: function(o, t, i) {
          var a = this.createSplitEdgePts(o, t);
          i.add(a, !1);
        } }, { key: "iterator", value: function() {
          return this._nodeMap.values().iterator();
        } }, { key: "addSplitEdges", value: function(o) {
          this.addEndpoints(), this.addCollapsedNodes();
          for (var t = this.iterator(), i = t.next(); t.hasNext(); ) {
            var a = t.next(), l = this.createSplitEdge(i, a);
            o.add(l), i = a;
          }
        } }, { key: "findCollapseIndex", value: function(o, t, i) {
          if (!o.coord.equals2D(t.coord)) return !1;
          var a = t.segmentIndex - o.segmentIndex;
          return t.isInterior() || a--, a === 1 && (i[0] = o.segmentIndex + 1, !0);
        } }, { key: "findCollapsesFromInsertedNodes", value: function(o) {
          for (var t = new Array(1).fill(null), i = this.iterator(), a = i.next(); i.hasNext(); ) {
            var l = i.next();
            this.findCollapseIndex(a, l, t) && o.add(Qt.valueOf(t[0])), a = l;
          }
        } }, { key: "getEdge", value: function() {
          return this._edge;
        } }, { key: "addEndpoints", value: function() {
          var o = this._edge.size() - 1;
          this.add(this._edge.getCoordinate(0), 0), this.add(this._edge.getCoordinate(o), o);
        } }, { key: "createSplitEdge", value: function(o, t) {
          var i = this.createSplitEdgePts(o, t);
          return new _r(i, this._edge.getData());
        } }, { key: "add", value: function(o, t) {
          var i = new Wd(this._edge, o, t, this._edge.getSegmentOctant(t)), a = this._nodeMap.get(i);
          return a !== null ? (se.isTrue(a.coord.equals2D(o), "Found equal nodes with different coordinates"), a) : (this._nodeMap.put(i, i), i);
        } }, { key: "checkSplitEdgesCorrectness", value: function(o) {
          var t = this._edge.getCoordinates(), i = o.get(0).getCoordinate(0);
          if (!i.equals2D(t[0])) throw new de("bad split edge start point at " + i);
          var a = o.get(o.size() - 1).getCoordinates(), l = a[a.length - 1];
          if (!l.equals2D(t[t.length - 1])) throw new de("bad split edge end point at " + l);
        } }], [{ key: "constructor_", value: function() {
          this._nodeMap = new Gi(), this._edge = null;
          var o = arguments[0];
          this._edge = o;
        } }]);
      }(), $d = function() {
        function o() {
          u(this, o);
        }
        return h(o, null, [{ key: "octant", value: function() {
          if (typeof arguments[0] == "number" && typeof arguments[1] == "number") {
            var t = arguments[0], i = arguments[1];
            if (t === 0 && i === 0) throw new X("Cannot compute the octant for point ( " + t + ", " + i + " )");
            var a = Math.abs(t), l = Math.abs(i);
            return t >= 0 ? i >= 0 ? a >= l ? 0 : 1 : a >= l ? 7 : 6 : i >= 0 ? a >= l ? 3 : 2 : a >= l ? 4 : 5;
          }
          if (arguments[0] instanceof J && arguments[1] instanceof J) {
            var g = arguments[0], p = arguments[1], v = p.x - g.x, w = p.y - g.y;
            if (v === 0 && w === 0) throw new X("Cannot compute the octant for two identical points " + g);
            return o.octant(v, w);
          }
        } }]);
      }(), Kd = function() {
        return h(function o() {
          u(this, o);
        }, [{ key: "getCoordinates", value: function() {
        } }, { key: "size", value: function() {
        } }, { key: "getCoordinate", value: function(o) {
        } }, { key: "isClosed", value: function() {
        } }, { key: "setData", value: function(o) {
        } }, { key: "getData", value: function() {
        } }]);
      }(), Qd = function() {
        return h(function o() {
          u(this, o);
        }, [{ key: "addIntersection", value: function(o, t) {
        } }, { key: "interfaces_", get: function() {
          return [Kd];
        } }]);
      }(), _r = function() {
        function o() {
          u(this, o), o.constructor_.apply(this, arguments);
        }
        return h(o, [{ key: "getCoordinates", value: function() {
          return this._pts;
        } }, { key: "size", value: function() {
          return this._pts.length;
        } }, { key: "getCoordinate", value: function(t) {
          return this._pts[t];
        } }, { key: "isClosed", value: function() {
          return this._pts[0].equals(this._pts[this._pts.length - 1]);
        } }, { key: "getSegmentOctant", value: function(t) {
          return t === this._pts.length - 1 ? -1 : this.safeOctant(this.getCoordinate(t), this.getCoordinate(t + 1));
        } }, { key: "setData", value: function(t) {
          this._data = t;
        } }, { key: "safeOctant", value: function(t, i) {
          return t.equals2D(i) ? 0 : $d.octant(t, i);
        } }, { key: "getData", value: function() {
          return this._data;
        } }, { key: "addIntersection", value: function() {
          if (arguments.length === 2) {
            var t = arguments[0], i = arguments[1];
            this.addIntersectionNode(t, i);
          } else if (arguments.length === 4) {
            var a = arguments[1], l = arguments[3], g = new J(arguments[0].getIntersection(l));
            this.addIntersection(g, a);
          }
        } }, { key: "toString", value: function() {
          return so.toLineString(new je(this._pts));
        } }, { key: "getNodeList", value: function() {
          return this._nodeList;
        } }, { key: "addIntersectionNode", value: function(t, i) {
          var a = i, l = a + 1;
          if (l < this._pts.length) {
            var g = this._pts[l];
            t.equals2D(g) && (a = l);
          }
          return this._nodeList.add(t, a);
        } }, { key: "addIntersections", value: function(t, i, a) {
          for (var l = 0; l < t.getIntersectionNum(); l++) this.addIntersection(t, i, a, l);
        } }, { key: "interfaces_", get: function() {
          return [Qd];
        } }], [{ key: "constructor_", value: function() {
          this._nodeList = new jd(this), this._pts = null, this._data = null;
          var t = arguments[0], i = arguments[1];
          this._pts = t, this._data = i;
        } }, { key: "getNodedSubstrings", value: function() {
          if (arguments.length === 1) {
            var t = arguments[0], i = new me();
            return o.getNodedSubstrings(t, i), i;
          }
          if (arguments.length === 2) for (var a = arguments[1], l = arguments[0].iterator(); l.hasNext(); )
            l.next().getNodeList().addSplitEdges(a);
        } }]);
      }(), Lt = function() {
        function o() {
          u(this, o), o.constructor_.apply(this, arguments);
        }
        return h(o, [{ key: "minX", value: function() {
          return Math.min(this.p0.x, this.p1.x);
        } }, { key: "orientationIndex", value: function() {
          if (arguments[0] instanceof o) {
            var t = arguments[0], i = _e.index(this.p0, this.p1, t.p0), a = _e.index(this.p0, this.p1, t.p1);
            return i >= 0 && a >= 0 || i <= 0 && a <= 0 ? Math.max(i, a) : 0;
          }
          if (arguments[0] instanceof J) {
            var l = arguments[0];
            return _e.index(this.p0, this.p1, l);
          }
        } }, { key: "toGeometry", value: function(t) {
          return t.createLineString([this.p0, this.p1]);
        } }, { key: "isVertical", value: function() {
          return this.p0.x === this.p1.x;
        } }, { key: "equals", value: function(t) {
          if (!(t instanceof o)) return !1;
          var i = t;
          return this.p0.equals(i.p0) && this.p1.equals(i.p1);
        } }, { key: "intersection", value: function(t) {
          var i = new yr();
          return i.computeIntersection(this.p0, this.p1, t.p0, t.p1), i.hasIntersection() ? i.getIntersection(0) : null;
        } }, { key: "project", value: function() {
          if (arguments[0] instanceof J) {
            var t = arguments[0];
            if (t.equals(this.p0) || t.equals(this.p1)) return new J(t);
            var i = this.projectionFactor(t), a = new J();
            return a.x = this.p0.x + i * (this.p1.x - this.p0.x), a.y = this.p0.y + i * (this.p1.y - this.p0.y), a;
          }
          if (arguments[0] instanceof o) {
            var l = arguments[0], g = this.projectionFactor(l.p0), p = this.projectionFactor(l.p1);
            if (g >= 1 && p >= 1 || g <= 0 && p <= 0) return null;
            var v = this.project(l.p0);
            g < 0 && (v = this.p0), g > 1 && (v = this.p1);
            var w = this.project(l.p1);
            return p < 0 && (w = this.p0), p > 1 && (w = this.p1), new o(v, w);
          }
        } }, { key: "normalize", value: function() {
          this.p1.compareTo(this.p0) < 0 && this.reverse();
        } }, { key: "angle", value: function() {
          return Math.atan2(this.p1.y - this.p0.y, this.p1.x - this.p0.x);
        } }, { key: "getCoordinate", value: function(t) {
          return t === 0 ? this.p0 : this.p1;
        } }, { key: "distancePerpendicular", value: function(t) {
          return Ft.pointToLinePerpendicular(t, this.p0, this.p1);
        } }, { key: "minY", value: function() {
          return Math.min(this.p0.y, this.p1.y);
        } }, { key: "midPoint", value: function() {
          return o.midPoint(this.p0, this.p1);
        } }, { key: "projectionFactor", value: function(t) {
          if (t.equals(this.p0)) return 0;
          if (t.equals(this.p1)) return 1;
          var i = this.p1.x - this.p0.x, a = this.p1.y - this.p0.y, l = i * i + a * a;
          return l <= 0 ? K.NaN : ((t.x - this.p0.x) * i + (t.y - this.p0.y) * a) / l;
        } }, { key: "closestPoints", value: function(t) {
          var i = this.intersection(t);
          if (i !== null) return [i, i];
          var a = new Array(2).fill(null), l = K.MAX_VALUE, g = null, p = this.closestPoint(t.p0);
          l = p.distance(t.p0), a[0] = p, a[1] = t.p0;
          var v = this.closestPoint(t.p1);
          (g = v.distance(t.p1)) < l && (l = g, a[0] = v, a[1] = t.p1);
          var w = t.closestPoint(this.p0);
          (g = w.distance(this.p0)) < l && (l = g, a[0] = this.p0, a[1] = w);
          var b = t.closestPoint(this.p1);
          return (g = b.distance(this.p1)) < l && (l = g, a[0] = this.p1, a[1] = b), a;
        } }, { key: "closestPoint", value: function(t) {
          var i = this.projectionFactor(t);
          return i > 0 && i < 1 ? this.project(t) : this.p0.distance(t) < this.p1.distance(t) ? this.p0 : this.p1;
        } }, { key: "maxX", value: function() {
          return Math.max(this.p0.x, this.p1.x);
        } }, { key: "getLength", value: function() {
          return this.p0.distance(this.p1);
        } }, { key: "compareTo", value: function(t) {
          var i = t, a = this.p0.compareTo(i.p0);
          return a !== 0 ? a : this.p1.compareTo(i.p1);
        } }, { key: "reverse", value: function() {
          var t = this.p0;
          this.p0 = this.p1, this.p1 = t;
        } }, { key: "equalsTopo", value: function(t) {
          return this.p0.equals(t.p0) && this.p1.equals(t.p1) || this.p0.equals(t.p1) && this.p1.equals(t.p0);
        } }, { key: "lineIntersection", value: function(t) {
          return Ai.intersection(this.p0, this.p1, t.p0, t.p1);
        } }, { key: "maxY", value: function() {
          return Math.max(this.p0.y, this.p1.y);
        } }, { key: "pointAlongOffset", value: function(t, i) {
          var a = this.p0.x + t * (this.p1.x - this.p0.x), l = this.p0.y + t * (this.p1.y - this.p0.y), g = this.p1.x - this.p0.x, p = this.p1.y - this.p0.y, v = Math.sqrt(g * g + p * p), w = 0, b = 0;
          if (i !== 0) {
            if (v <= 0) throw new IllegalStateException("Cannot compute offset from zero-length line segment");
            w = i * g / v, b = i * p / v;
          }
          return new J(a - b, l + w);
        } }, { key: "setCoordinates", value: function() {
          if (arguments.length === 1) {
            var t = arguments[0];
            this.setCoordinates(t.p0, t.p1);
          } else if (arguments.length === 2) {
            var i = arguments[0], a = arguments[1];
            this.p0.x = i.x, this.p0.y = i.y, this.p1.x = a.x, this.p1.y = a.y;
          }
        } }, { key: "segmentFraction", value: function(t) {
          var i = this.projectionFactor(t);
          return i < 0 ? i = 0 : (i > 1 || K.isNaN(i)) && (i = 1), i;
        } }, { key: "toString", value: function() {
          return "LINESTRING( " + this.p0.x + " " + this.p0.y + ", " + this.p1.x + " " + this.p1.y + ")";
        } }, { key: "isHorizontal", value: function() {
          return this.p0.y === this.p1.y;
        } }, { key: "reflect", value: function(t) {
          var i = this.p1.getY() - this.p0.getY(), a = this.p0.getX() - this.p1.getX(), l = this.p0.getY() * (this.p1.getX() - this.p0.getX()) - this.p0.getX() * (this.p1.getY() - this.p0.getY()), g = i * i + a * a, p = i * i - a * a, v = t.getX(), w = t.getY();
          return new J((-p * v - 2 * i * a * w - 2 * i * l) / g, (p * w - 2 * i * a * v - 2 * a * l) / g);
        } }, { key: "distance", value: function() {
          if (arguments[0] instanceof o) {
            var t = arguments[0];
            return Ft.segmentToSegment(this.p0, this.p1, t.p0, t.p1);
          }
          if (arguments[0] instanceof J) {
            var i = arguments[0];
            return Ft.pointToSegment(i, this.p0, this.p1);
          }
        } }, { key: "pointAlong", value: function(t) {
          var i = new J();
          return i.x = this.p0.x + t * (this.p1.x - this.p0.x), i.y = this.p0.y + t * (this.p1.y - this.p0.y), i;
        } }, { key: "hashCode", value: function() {
          var t = K.doubleToLongBits(this.p0.x);
          t ^= 31 * K.doubleToLongBits(this.p0.y);
          var i = Math.trunc(t) ^ Math.trunc(t >> 32), a = K.doubleToLongBits(this.p1.x);
          return a ^= 31 * K.doubleToLongBits(this.p1.y), i ^ (Math.trunc(a) ^ Math.trunc(a >> 32));
        } }, { key: "interfaces_", get: function() {
          return [$, k];
        } }], [{ key: "constructor_", value: function() {
          if (this.p0 = null, this.p1 = null, arguments.length === 0) o.constructor_.call(this, new J(), new J());
          else if (arguments.length === 1) {
            var t = arguments[0];
            o.constructor_.call(this, t.p0, t.p1);
          } else if (arguments.length === 2) {
            var i = arguments[0], a = arguments[1];
            this.p0 = i, this.p1 = a;
          } else if (arguments.length === 4) {
            var l = arguments[0], g = arguments[1], p = arguments[2], v = arguments[3];
            o.constructor_.call(this, new J(l, g), new J(p, v));
          }
        } }, { key: "midPoint", value: function(t, i) {
          return new J((t.x + i.x) / 2, (t.y + i.y) / 2);
        } }]);
      }(), ep = function() {
        return h(function o() {
          u(this, o), o.constructor_.apply(this, arguments);
        }, [{ key: "overlap", value: function() {
          if (arguments.length !== 2) {
            if (arguments.length === 4) {
              var o = arguments[1], t = arguments[2], i = arguments[3];
              arguments[0].getLineSegment(o, this._overlapSeg1), t.getLineSegment(i, this._overlapSeg2), this.overlap(this._overlapSeg1, this._overlapSeg2);
            }
          }
        } }], [{ key: "constructor_", value: function() {
          this._overlapSeg1 = new Lt(), this._overlapSeg2 = new Lt();
        } }]);
      }(), Nl = function() {
        return h(function o() {
          u(this, o), o.constructor_.apply(this, arguments);
        }, [{ key: "getLineSegment", value: function(o, t) {
          t.p0 = this._pts[o], t.p1 = this._pts[o + 1];
        } }, { key: "computeSelect", value: function(o, t, i, a) {
          var l = this._pts[t], g = this._pts[i];
          if (i - t == 1) return a.select(this, t), null;
          if (!o.intersects(l, g)) return null;
          var p = Math.trunc((t + i) / 2);
          t < p && this.computeSelect(o, t, p, a), p < i && this.computeSelect(o, p, i, a);
        } }, { key: "getCoordinates", value: function() {
          for (var o = new Array(this._end - this._start + 1).fill(null), t = 0, i = this._start; i <= this._end; i++) o[t++] = this._pts[i];
          return o;
        } }, { key: "computeOverlaps", value: function() {
          if (arguments.length === 2) {
            var o = arguments[0], t = arguments[1];
            this.computeOverlaps(this._start, this._end, o, o._start, o._end, t);
          } else if (arguments.length === 6) {
            var i = arguments[0], a = arguments[1], l = arguments[2], g = arguments[3], p = arguments[4], v = arguments[5];
            if (a - i == 1 && p - g == 1) return v.overlap(this, i, l, g), null;
            if (!this.overlaps(i, a, l, g, p)) return null;
            var w = Math.trunc((i + a) / 2), b = Math.trunc((g + p) / 2);
            i < w && (g < b && this.computeOverlaps(i, w, l, g, b, v), b < p && this.computeOverlaps(i, w, l, b, p, v)), w < a && (g < b && this.computeOverlaps(w, a, l, g, b, v), b < p && this.computeOverlaps(w, a, l, b, p, v));
          }
        } }, { key: "setId", value: function(o) {
          this._id = o;
        } }, { key: "select", value: function(o, t) {
          this.computeSelect(o, this._start, this._end, t);
        } }, { key: "getEnvelope", value: function() {
          if (this._env === null) {
            var o = this._pts[this._start], t = this._pts[this._end];
            this._env = new be(o, t);
          }
          return this._env;
        } }, { key: "overlaps", value: function(o, t, i, a, l) {
          return be.intersects(this._pts[o], this._pts[t], i._pts[a], i._pts[l]);
        } }, { key: "getEndIndex", value: function() {
          return this._end;
        } }, { key: "getStartIndex", value: function() {
          return this._start;
        } }, { key: "getContext", value: function() {
          return this._context;
        } }, { key: "getId", value: function() {
          return this._id;
        } }], [{ key: "constructor_", value: function() {
          this._pts = null, this._start = null, this._end = null, this._env = null, this._context = null, this._id = null;
          var o = arguments[0], t = arguments[1], i = arguments[2], a = arguments[3];
          this._pts = o, this._start = t, this._end = i, this._context = a;
        } }]);
      }(), tp = function() {
        function o() {
          u(this, o);
        }
        return h(o, null, [{ key: "findChainEnd", value: function(t, i) {
          for (var a = i; a < t.length - 1 && t[a].equals2D(t[a + 1]); ) a++;
          if (a >= t.length - 1) return t.length - 1;
          for (var l = gt.quadrant(t[a], t[a + 1]), g = i + 1; g < t.length && !(!t[g - 1].equals2D(t[g]) && gt.quadrant(t[g - 1], t[g]) !== l); )
            g++;
          return g - 1;
        } }, { key: "getChains", value: function() {
          if (arguments.length === 1) {
            var t = arguments[0];
            return o.getChains(t, null);
          }
          if (arguments.length === 2) {
            var i = arguments[0], a = arguments[1], l = new me(), g = 0;
            do {
              var p = o.findChainEnd(i, g), v = new Nl(i, g, p, a);
              l.add(v), g = p;
            } while (g < i.length - 1);
            return l;
          }
        } }]);
      }(), lo = function() {
        return h(function o() {
          u(this, o);
        }, [{ key: "computeNodes", value: function(o) {
        } }, { key: "getNodedSubstrings", value: function() {
        } }]);
      }(), Ol = function() {
        return h(function o() {
          u(this, o), o.constructor_.apply(this, arguments);
        }, [{ key: "setSegmentIntersector", value: function(o) {
          this._segInt = o;
        } }, { key: "interfaces_", get: function() {
          return [lo];
        } }], [{ key: "constructor_", value: function() {
          if (this._segInt = null, arguments.length !== 0) {
            if (arguments.length === 1) {
              var o = arguments[0];
              this.setSegmentIntersector(o);
            }
          }
        } }]);
      }(), co = function(o) {
        function t() {
          var i;
          return u(this, t), i = s(this, t), t.constructor_.apply(i, arguments), i;
        }
        return _(t, o), h(t, [{ key: "getMonotoneChains", value: function() {
          return this._monoChains;
        } }, { key: "getNodedSubstrings", value: function() {
          return _r.getNodedSubstrings(this._nodedSegStrings);
        } }, { key: "getIndex", value: function() {
          return this._index;
        } }, { key: "add", value: function(i) {
          for (var a = tp.getChains(i.getCoordinates(), i).iterator(); a.hasNext(); ) {
            var l = a.next();
            l.setId(this._idCounter++), this._index.insert(l.getEnvelope(), l), this._monoChains.add(l);
          }
        } }, { key: "computeNodes", value: function(i) {
          this._nodedSegStrings = i;
          for (var a = i.iterator(); a.hasNext(); ) this.add(a.next());
          this.intersectChains();
        } }, { key: "intersectChains", value: function() {
          for (var i = new Pl(this._segInt), a = this._monoChains.iterator(); a.hasNext(); ) for (var l = a.next(), g = this._index.query(l.getEnvelope()).iterator(); g.hasNext(); ) {
            var p = g.next();
            if (p.getId() > l.getId() && (l.computeOverlaps(p, i), this._nOverlaps++), this._segInt.isDone()) return null;
          }
        } }], [{ key: "constructor_", value: function() {
          if (this._monoChains = new me(), this._index = new _n(), this._idCounter = 0, this._nodedSegStrings = null, this._nOverlaps = 0, arguments.length !== 0) {
            if (arguments.length === 1) {
              var i = arguments[0];
              Ol.constructor_.call(this, i);
            }
          }
        } }]);
      }(Ol), Pl = function(o) {
        function t() {
          var i;
          return u(this, t), i = s(this, t), t.constructor_.apply(i, arguments), i;
        }
        return _(t, o), h(t, [{ key: "overlap", value: function() {
          if (arguments.length !== 4) return I(t, "overlap", this, 1).apply(this, arguments);
          var i = arguments[1], a = arguments[2], l = arguments[3], g = arguments[0].getContext(), p = a.getContext();
          this._si.processIntersections(g, i, p, l);
        } }], [{ key: "constructor_", value: function() {
          this._si = null;
          var i = arguments[0];
          this._si = i;
        } }]);
      }(ep);
      co.SegmentOverlapAction = Pl;
      var nn = function() {
        function o() {
          u(this, o), o.constructor_.apply(this, arguments);
        }
        return h(o, [{ key: "isDeletable", value: function(t, i, a, l) {
          var g = this._inputLine[t], p = this._inputLine[i], v = this._inputLine[a];
          return !!this.isConcave(g, p, v) && !!this.isShallow(g, p, v, l) && this.isShallowSampled(g, p, t, a, l);
        } }, { key: "deleteShallowConcavities", value: function() {
          for (var t = 1, i = this.findNextNonDeletedIndex(t), a = this.findNextNonDeletedIndex(i), l = !1; a < this._inputLine.length; ) {
            var g = !1;
            this.isDeletable(t, i, a, this._distanceTol) && (this._isDeleted[i] = o.DELETE, g = !0, l = !0), t = g ? a : i, i = this.findNextNonDeletedIndex(t), a = this.findNextNonDeletedIndex(i);
          }
          return l;
        } }, { key: "isShallowConcavity", value: function(t, i, a, l) {
          return _e.index(t, i, a) === this._angleOrientation && Ft.pointToSegment(i, t, a) < l;
        } }, { key: "isShallowSampled", value: function(t, i, a, l, g) {
          var p = Math.trunc((l - a) / o.NUM_PTS_TO_CHECK);
          p <= 0 && (p = 1);
          for (var v = a; v < l; v += p) if (!this.isShallow(t, i, this._inputLine[v], g)) return !1;
          return !0;
        } }, { key: "isConcave", value: function(t, i, a) {
          var l = _e.index(t, i, a) === this._angleOrientation;
          return l;
        } }, { key: "simplify", value: function(t) {
          this._distanceTol = Math.abs(t), t < 0 && (this._angleOrientation = _e.CLOCKWISE), this._isDeleted = new Array(this._inputLine.length).fill(null);
          var i = !1;
          do
            i = this.deleteShallowConcavities();
          while (i);
          return this.collapseLine();
        } }, { key: "findNextNonDeletedIndex", value: function(t) {
          for (var i = t + 1; i < this._inputLine.length && this._isDeleted[i] === o.DELETE; ) i++;
          return i;
        } }, { key: "isShallow", value: function(t, i, a, l) {
          return Ft.pointToSegment(i, t, a) < l;
        } }, { key: "collapseLine", value: function() {
          for (var t = new te(), i = 0; i < this._inputLine.length; i++) this._isDeleted[i] !== o.DELETE && t.add(this._inputLine[i]);
          return t.toCoordinateArray();
        } }], [{ key: "constructor_", value: function() {
          this._inputLine = null, this._distanceTol = null, this._isDeleted = null, this._angleOrientation = _e.COUNTERCLOCKWISE;
          var t = arguments[0];
          this._inputLine = t;
        } }, { key: "simplify", value: function(t, i) {
          return new o(t).simplify(i);
        } }]);
      }();
      nn.INIT = 0, nn.DELETE = 1, nn.KEEP = 1, nn.NUM_PTS_TO_CHECK = 10;
      var Rl = function() {
        function o() {
          u(this, o), o.constructor_.apply(this, arguments);
        }
        return h(o, [{ key: "getCoordinates", value: function() {
          return this._ptList.toArray(o.COORDINATE_ARRAY_TYPE);
        } }, { key: "setPrecisionModel", value: function(t) {
          this._precisionModel = t;
        } }, { key: "addPt", value: function(t) {
          var i = new J(t);
          if (this._precisionModel.makePrecise(i), this.isRedundant(i)) return null;
          this._ptList.add(i);
        } }, { key: "reverse", value: function() {
        } }, { key: "addPts", value: function(t, i) {
          if (i) for (var a = 0; a < t.length; a++) this.addPt(t[a]);
          else for (var l = t.length - 1; l >= 0; l--) this.addPt(t[l]);
        } }, { key: "isRedundant", value: function(t) {
          if (this._ptList.size() < 1) return !1;
          var i = this._ptList.get(this._ptList.size() - 1);
          return t.distance(i) < this._minimimVertexDistance;
        } }, { key: "toString", value: function() {
          return new Yr().createLineString(this.getCoordinates()).toString();
        } }, { key: "closeRing", value: function() {
          if (this._ptList.size() < 1) return null;
          var t = new J(this._ptList.get(0)), i = this._ptList.get(this._ptList.size() - 1);
          if (t.equals(i)) return null;
          this._ptList.add(t);
        } }, { key: "setMinimumVertexDistance", value: function(t) {
          this._minimimVertexDistance = t;
        } }], [{ key: "constructor_", value: function() {
          this._ptList = null, this._precisionModel = null, this._minimimVertexDistance = 0, this._ptList = new me();
        } }]);
      }();
      Rl.COORDINATE_ARRAY_TYPE = new Array(0).fill(null);
      var Ct = function() {
        function o() {
          u(this, o);
        }
        return h(o, null, [{ key: "toDegrees", value: function(t) {
          return 180 * t / Math.PI;
        } }, { key: "normalize", value: function(t) {
          for (; t > Math.PI; ) t -= o.PI_TIMES_2;
          for (; t <= -Math.PI; ) t += o.PI_TIMES_2;
          return t;
        } }, { key: "angle", value: function() {
          if (arguments.length === 1) {
            var t = arguments[0];
            return Math.atan2(t.y, t.x);
          }
          if (arguments.length === 2) {
            var i = arguments[0], a = arguments[1], l = a.x - i.x, g = a.y - i.y;
            return Math.atan2(g, l);
          }
        } }, { key: "isAcute", value: function(t, i, a) {
          var l = t.x - i.x, g = t.y - i.y;
          return l * (a.x - i.x) + g * (a.y - i.y) > 0;
        } }, { key: "isObtuse", value: function(t, i, a) {
          var l = t.x - i.x, g = t.y - i.y;
          return l * (a.x - i.x) + g * (a.y - i.y) < 0;
        } }, { key: "interiorAngle", value: function(t, i, a) {
          var l = o.angle(i, t), g = o.angle(i, a);
          return Math.abs(g - l);
        } }, { key: "normalizePositive", value: function(t) {
          if (t < 0) {
            for (; t < 0; ) t += o.PI_TIMES_2;
            t >= o.PI_TIMES_2 && (t = 0);
          } else {
            for (; t >= o.PI_TIMES_2; ) t -= o.PI_TIMES_2;
            t < 0 && (t = 0);
          }
          return t;
        } }, { key: "angleBetween", value: function(t, i, a) {
          var l = o.angle(i, t), g = o.angle(i, a);
          return o.diff(l, g);
        } }, { key: "diff", value: function(t, i) {
          var a = null;
          return (a = t < i ? i - t : t - i) > Math.PI && (a = 2 * Math.PI - a), a;
        } }, { key: "toRadians", value: function(t) {
          return t * Math.PI / 180;
        } }, { key: "getTurn", value: function(t, i) {
          var a = Math.sin(i - t);
          return a > 0 ? o.COUNTERCLOCKWISE : a < 0 ? o.CLOCKWISE : o.NONE;
        } }, { key: "angleBetweenOriented", value: function(t, i, a) {
          var l = o.angle(i, t), g = o.angle(i, a) - l;
          return g <= -Math.PI ? g + o.PI_TIMES_2 : g > Math.PI ? g - o.PI_TIMES_2 : g;
        } }]);
      }();
      Ct.PI_TIMES_2 = 2 * Math.PI, Ct.PI_OVER_2 = Math.PI / 2, Ct.PI_OVER_4 = Math.PI / 4, Ct.COUNTERCLOCKWISE = _e.COUNTERCLOCKWISE, Ct.CLOCKWISE = _e.CLOCKWISE, Ct.NONE = _e.COLLINEAR;
      var Bi = function() {
        function o() {
          u(this, o), o.constructor_.apply(this, arguments);
        }
        return h(o, [{ key: "addNextSegment", value: function(t, i) {
          if (this._s0 = this._s1, this._s1 = this._s2, this._s2 = t, this._seg0.setCoordinates(this._s0, this._s1), this.computeOffsetSegment(this._seg0, this._side, this._distance, this._offset0), this._seg1.setCoordinates(this._s1, this._s2), this.computeOffsetSegment(this._seg1, this._side, this._distance, this._offset1), this._s1.equals(this._s2)) return null;
          var a = _e.index(this._s0, this._s1, this._s2), l = a === _e.CLOCKWISE && this._side === ne.LEFT || a === _e.COUNTERCLOCKWISE && this._side === ne.RIGHT;
          a === 0 ? this.addCollinear(i) : l ? this.addOutsideTurn(a, i) : this.addInsideTurn(a, i);
        } }, { key: "addLineEndCap", value: function(t, i) {
          var a = new Lt(t, i), l = new Lt();
          this.computeOffsetSegment(a, ne.LEFT, this._distance, l);
          var g = new Lt();
          this.computeOffsetSegment(a, ne.RIGHT, this._distance, g);
          var p = i.x - t.x, v = i.y - t.y, w = Math.atan2(v, p);
          switch (this._bufParams.getEndCapStyle()) {
            case H.CAP_ROUND:
              this._segList.addPt(l.p1), this.addDirectedFillet(i, w + Math.PI / 2, w - Math.PI / 2, _e.CLOCKWISE, this._distance), this._segList.addPt(g.p1);
              break;
            case H.CAP_FLAT:
              this._segList.addPt(l.p1), this._segList.addPt(g.p1);
              break;
            case H.CAP_SQUARE:
              var b = new J();
              b.x = Math.abs(this._distance) * Math.cos(w), b.y = Math.abs(this._distance) * Math.sin(w);
              var z = new J(l.p1.x + b.x, l.p1.y + b.y), W = new J(g.p1.x + b.x, g.p1.y + b.y);
              this._segList.addPt(z), this._segList.addPt(W);
          }
        } }, { key: "getCoordinates", value: function() {
          return this._segList.getCoordinates();
        } }, { key: "addMitreJoin", value: function(t, i, a, l) {
          var g = Ai.intersection(i.p0, i.p1, a.p0, a.p1);
          if (g !== null && (l <= 0 ? 1 : g.distance(t) / Math.abs(l)) <= this._bufParams.getMitreLimit()) return this._segList.addPt(g), null;
          this.addLimitedMitreJoin(i, a, l, this._bufParams.getMitreLimit());
        } }, { key: "addOutsideTurn", value: function(t, i) {
          if (this._offset0.p1.distance(this._offset1.p0) < this._distance * o.OFFSET_SEGMENT_SEPARATION_FACTOR) return this._segList.addPt(this._offset0.p1), null;
          this._bufParams.getJoinStyle() === H.JOIN_MITRE ? this.addMitreJoin(this._s1, this._offset0, this._offset1, this._distance) : this._bufParams.getJoinStyle() === H.JOIN_BEVEL ? this.addBevelJoin(this._offset0, this._offset1) : (i && this._segList.addPt(this._offset0.p1), this.addCornerFillet(this._s1, this._offset0.p1, this._offset1.p0, t, this._distance), this._segList.addPt(this._offset1.p0));
        } }, { key: "createSquare", value: function(t) {
          this._segList.addPt(new J(t.x + this._distance, t.y + this._distance)), this._segList.addPt(new J(t.x + this._distance, t.y - this._distance)), this._segList.addPt(new J(t.x - this._distance, t.y - this._distance)), this._segList.addPt(new J(t.x - this._distance, t.y + this._distance)), this._segList.closeRing();
        } }, { key: "addSegments", value: function(t, i) {
          this._segList.addPts(t, i);
        } }, { key: "addFirstSegment", value: function() {
          this._segList.addPt(this._offset1.p0);
        } }, { key: "addCornerFillet", value: function(t, i, a, l, g) {
          var p = i.x - t.x, v = i.y - t.y, w = Math.atan2(v, p), b = a.x - t.x, z = a.y - t.y, W = Math.atan2(z, b);
          l === _e.CLOCKWISE ? w <= W && (w += 2 * Math.PI) : w >= W && (w -= 2 * Math.PI), this._segList.addPt(i), this.addDirectedFillet(t, w, W, l, g), this._segList.addPt(a);
        } }, { key: "addLastSegment", value: function() {
          this._segList.addPt(this._offset1.p1);
        } }, { key: "initSideSegments", value: function(t, i, a) {
          this._s1 = t, this._s2 = i, this._side = a, this._seg1.setCoordinates(t, i), this.computeOffsetSegment(this._seg1, a, this._distance, this._offset1);
        } }, { key: "addLimitedMitreJoin", value: function(t, i, a, l) {
          var g = this._seg0.p1, p = Ct.angle(g, this._seg0.p0), v = Ct.angleBetweenOriented(this._seg0.p0, g, this._seg1.p1) / 2, w = Ct.normalize(p + v), b = Ct.normalize(w + Math.PI), z = l * a, W = a - z * Math.abs(Math.sin(v)), Q = g.x + z * Math.cos(b), le = g.y + z * Math.sin(b), fe = new J(Q, le), ve = new Lt(g, fe), Te = ve.pointAlongOffset(1, W), Ie = ve.pointAlongOffset(1, -W);
          this._side === ne.LEFT ? (this._segList.addPt(Te), this._segList.addPt(Ie)) : (this._segList.addPt(Ie), this._segList.addPt(Te));
        } }, { key: "addDirectedFillet", value: function(t, i, a, l, g) {
          var p = l === _e.CLOCKWISE ? -1 : 1, v = Math.abs(i - a), w = Math.trunc(v / this._filletAngleQuantum + 0.5);
          if (w < 1) return null;
          for (var b = v / w, z = new J(), W = 0; W < w; W++) {
            var Q = i + p * W * b;
            z.x = t.x + g * Math.cos(Q), z.y = t.y + g * Math.sin(Q), this._segList.addPt(z);
          }
        } }, { key: "computeOffsetSegment", value: function(t, i, a, l) {
          var g = i === ne.LEFT ? 1 : -1, p = t.p1.x - t.p0.x, v = t.p1.y - t.p0.y, w = Math.sqrt(p * p + v * v), b = g * a * p / w, z = g * a * v / w;
          l.p0.x = t.p0.x - z, l.p0.y = t.p0.y + b, l.p1.x = t.p1.x - z, l.p1.y = t.p1.y + b;
        } }, { key: "addInsideTurn", value: function(t, i) {
          if (this._li.computeIntersection(this._offset0.p0, this._offset0.p1, this._offset1.p0, this._offset1.p1), this._li.hasIntersection()) this._segList.addPt(this._li.getIntersection(0));
          else if (this._hasNarrowConcaveAngle = !0, this._offset0.p1.distance(this._offset1.p0) < this._distance * o.INSIDE_TURN_VERTEX_SNAP_DISTANCE_FACTOR) this._segList.addPt(this._offset0.p1);
          else {
            if (this._segList.addPt(this._offset0.p1), this._closingSegLengthFactor > 0) {
              var a = new J((this._closingSegLengthFactor * this._offset0.p1.x + this._s1.x) / (this._closingSegLengthFactor + 1), (this._closingSegLengthFactor * this._offset0.p1.y + this._s1.y) / (this._closingSegLengthFactor + 1));
              this._segList.addPt(a);
              var l = new J((this._closingSegLengthFactor * this._offset1.p0.x + this._s1.x) / (this._closingSegLengthFactor + 1), (this._closingSegLengthFactor * this._offset1.p0.y + this._s1.y) / (this._closingSegLengthFactor + 1));
              this._segList.addPt(l);
            } else this._segList.addPt(this._s1);
            this._segList.addPt(this._offset1.p0);
          }
        } }, { key: "createCircle", value: function(t) {
          var i = new J(t.x + this._distance, t.y);
          this._segList.addPt(i), this.addDirectedFillet(t, 0, 2 * Math.PI, -1, this._distance), this._segList.closeRing();
        } }, { key: "addBevelJoin", value: function(t, i) {
          this._segList.addPt(t.p1), this._segList.addPt(i.p0);
        } }, { key: "init", value: function(t) {
          this._distance = t, this._maxCurveSegmentError = t * (1 - Math.cos(this._filletAngleQuantum / 2)), this._segList = new Rl(), this._segList.setPrecisionModel(this._precisionModel), this._segList.setMinimumVertexDistance(t * o.CURVE_VERTEX_SNAP_DISTANCE_FACTOR);
        } }, { key: "addCollinear", value: function(t) {
          this._li.computeIntersection(this._s0, this._s1, this._s1, this._s2), this._li.getIntersectionNum() >= 2 && (this._bufParams.getJoinStyle() === H.JOIN_BEVEL || this._bufParams.getJoinStyle() === H.JOIN_MITRE ? (t && this._segList.addPt(this._offset0.p1), this._segList.addPt(this._offset1.p0)) : this.addCornerFillet(this._s1, this._offset0.p1, this._offset1.p0, _e.CLOCKWISE, this._distance));
        } }, { key: "closeRing", value: function() {
          this._segList.closeRing();
        } }, { key: "hasNarrowConcaveAngle", value: function() {
          return this._hasNarrowConcaveAngle;
        } }], [{ key: "constructor_", value: function() {
          this._maxCurveSegmentError = 0, this._filletAngleQuantum = null, this._closingSegLengthFactor = 1, this._segList = null, this._distance = 0, this._precisionModel = null, this._bufParams = null, this._li = null, this._s0 = null, this._s1 = null, this._s2 = null, this._seg0 = new Lt(), this._seg1 = new Lt(), this._offset0 = new Lt(), this._offset1 = new Lt(), this._side = 0, this._hasNarrowConcaveAngle = !1;
          var t = arguments[0], i = arguments[1], a = arguments[2];
          this._precisionModel = t, this._bufParams = i, this._li = new yr(), this._filletAngleQuantum = Math.PI / 2 / i.getQuadrantSegments(), i.getQuadrantSegments() >= 8 && i.getJoinStyle() === H.JOIN_ROUND && (this._closingSegLengthFactor = o.MAX_CLOSING_SEG_LEN_FACTOR), this.init(a);
        } }]);
      }();
      Bi.OFFSET_SEGMENT_SEPARATION_FACTOR = 1e-3, Bi.INSIDE_TURN_VERTEX_SNAP_DISTANCE_FACTOR = 1e-3, Bi.CURVE_VERTEX_SNAP_DISTANCE_FACTOR = 1e-6, Bi.MAX_CLOSING_SEG_LEN_FACTOR = 80;
      var np = function() {
        function o() {
          u(this, o), o.constructor_.apply(this, arguments);
        }
        return h(o, [{ key: "getOffsetCurve", value: function(t, i) {
          if (this._distance = i, i === 0) return null;
          var a = i < 0, l = Math.abs(i), g = this.getSegGen(l);
          t.length <= 1 ? this.computePointCurve(t[0], g) : this.computeOffsetCurve(t, a, g);
          var p = g.getCoordinates();
          return a && oe.reverse(p), p;
        } }, { key: "computeSingleSidedBufferCurve", value: function(t, i, a) {
          var l = this.simplifyTolerance(this._distance);
          if (i) {
            a.addSegments(t, !0);
            var g = nn.simplify(t, -l), p = g.length - 1;
            a.initSideSegments(g[p], g[p - 1], ne.LEFT), a.addFirstSegment();
            for (var v = p - 2; v >= 0; v--) a.addNextSegment(g[v], !0);
          } else {
            a.addSegments(t, !1);
            var w = nn.simplify(t, l), b = w.length - 1;
            a.initSideSegments(w[0], w[1], ne.LEFT), a.addFirstSegment();
            for (var z = 2; z <= b; z++) a.addNextSegment(w[z], !0);
          }
          a.addLastSegment(), a.closeRing();
        } }, { key: "computeRingBufferCurve", value: function(t, i, a) {
          var l = this.simplifyTolerance(this._distance);
          i === ne.RIGHT && (l = -l);
          var g = nn.simplify(t, l), p = g.length - 1;
          a.initSideSegments(g[p - 1], g[0], i);
          for (var v = 1; v <= p; v++) {
            var w = v !== 1;
            a.addNextSegment(g[v], w);
          }
          a.closeRing();
        } }, { key: "computeLineBufferCurve", value: function(t, i) {
          var a = this.simplifyTolerance(this._distance), l = nn.simplify(t, a), g = l.length - 1;
          i.initSideSegments(l[0], l[1], ne.LEFT);
          for (var p = 2; p <= g; p++) i.addNextSegment(l[p], !0);
          i.addLastSegment(), i.addLineEndCap(l[g - 1], l[g]);
          var v = nn.simplify(t, -a), w = v.length - 1;
          i.initSideSegments(v[w], v[w - 1], ne.LEFT);
          for (var b = w - 2; b >= 0; b--) i.addNextSegment(v[b], !0);
          i.addLastSegment(), i.addLineEndCap(v[1], v[0]), i.closeRing();
        } }, { key: "computePointCurve", value: function(t, i) {
          switch (this._bufParams.getEndCapStyle()) {
            case H.CAP_ROUND:
              i.createCircle(t);
              break;
            case H.CAP_SQUARE:
              i.createSquare(t);
          }
        } }, { key: "getLineCurve", value: function(t, i) {
          if (this._distance = i, this.isLineOffsetEmpty(i)) return null;
          var a = Math.abs(i), l = this.getSegGen(a);
          if (t.length <= 1) this.computePointCurve(t[0], l);
          else if (this._bufParams.isSingleSided()) {
            var g = i < 0;
            this.computeSingleSidedBufferCurve(t, g, l);
          } else this.computeLineBufferCurve(t, l);
          return l.getCoordinates();
        } }, { key: "getBufferParameters", value: function() {
          return this._bufParams;
        } }, { key: "simplifyTolerance", value: function(t) {
          return t * this._bufParams.getSimplifyFactor();
        } }, { key: "getRingCurve", value: function(t, i, a) {
          if (this._distance = a, t.length <= 2) return this.getLineCurve(t, a);
          if (a === 0) return o.copyCoordinates(t);
          var l = this.getSegGen(a);
          return this.computeRingBufferCurve(t, i, l), l.getCoordinates();
        } }, { key: "computeOffsetCurve", value: function(t, i, a) {
          var l = this.simplifyTolerance(this._distance);
          if (i) {
            var g = nn.simplify(t, -l), p = g.length - 1;
            a.initSideSegments(g[p], g[p - 1], ne.LEFT), a.addFirstSegment();
            for (var v = p - 2; v >= 0; v--) a.addNextSegment(g[v], !0);
          } else {
            var w = nn.simplify(t, l), b = w.length - 1;
            a.initSideSegments(w[0], w[1], ne.LEFT), a.addFirstSegment();
            for (var z = 2; z <= b; z++) a.addNextSegment(w[z], !0);
          }
          a.addLastSegment();
        } }, { key: "isLineOffsetEmpty", value: function(t) {
          return t === 0 || t < 0 && !this._bufParams.isSingleSided();
        } }, { key: "getSegGen", value: function(t) {
          return new Bi(this._precisionModel, this._bufParams, t);
        } }], [{ key: "constructor_", value: function() {
          this._distance = 0, this._precisionModel = null, this._bufParams = null;
          var t = arguments[0], i = arguments[1];
          this._precisionModel = t, this._bufParams = i;
        } }, { key: "copyCoordinates", value: function(t) {
          for (var i = new Array(t.length).fill(null), a = 0; a < i.length; a++) i[a] = new J(t[a]);
          return i;
        } }]);
      }(), Dl = function() {
        return h(function o() {
          u(this, o), o.constructor_.apply(this, arguments);
        }, [{ key: "findStabbedSegments", value: function() {
          if (arguments.length === 1) {
            for (var o = arguments[0], t = new me(), i = this._subgraphs.iterator(); i.hasNext(); ) {
              var a = i.next(), l = a.getEnvelope();
              o.y < l.getMinY() || o.y > l.getMaxY() || this.findStabbedSegments(o, a.getDirectedEdges(), t);
            }
            return t;
          }
          if (arguments.length === 3) {
            if (Ee(arguments[2], Nn) && arguments[0] instanceof J && arguments[1] instanceof uo) {
              for (var g = arguments[0], p = arguments[1], v = arguments[2], w = p.getEdge().getCoordinates(), b = 0; b < w.length - 1; b++)
                if (this._seg.p0 = w[b], this._seg.p1 = w[b + 1], this._seg.p0.y > this._seg.p1.y && this._seg.reverse(), !(Math.max(this._seg.p0.x, this._seg.p1.x) < g.x || this._seg.isHorizontal() || g.y < this._seg.p0.y || g.y > this._seg.p1.y || _e.index(this._seg.p0, this._seg.p1, g) === _e.RIGHT)) {
                  var z = p.getDepth(ne.LEFT);
                  this._seg.p0.equals(w[b]) || (z = p.getDepth(ne.RIGHT));
                  var W = new Fl(this._seg, z);
                  v.add(W);
                }
            } else if (Ee(arguments[2], Nn) && arguments[0] instanceof J && Ee(arguments[1], Nn)) for (var Q = arguments[0], le = arguments[2], fe = arguments[1].iterator(); fe.hasNext(); ) {
              var ve = fe.next();
              ve.isForward() && this.findStabbedSegments(Q, ve, le);
            }
          }
        } }, { key: "getDepth", value: function(o) {
          var t = this.findStabbedSegments(o);
          return t.size() === 0 ? 0 : Jr.min(t)._leftDepth;
        } }], [{ key: "constructor_", value: function() {
          this._subgraphs = null, this._seg = new Lt();
          var o = arguments[0];
          this._subgraphs = o;
        } }]);
      }(), Fl = function() {
        return h(function o() {
          u(this, o), o.constructor_.apply(this, arguments);
        }, [{ key: "compareTo", value: function(o) {
          var t = o;
          if (this._upwardSeg.minX() >= t._upwardSeg.maxX()) return 1;
          if (this._upwardSeg.maxX() <= t._upwardSeg.minX()) return -1;
          var i = this._upwardSeg.orientationIndex(t._upwardSeg);
          return i !== 0 || (i = -1 * t._upwardSeg.orientationIndex(this._upwardSeg)) !== 0 ? i : this._upwardSeg.compareTo(t._upwardSeg);
        } }, { key: "compareX", value: function(o, t) {
          var i = o.p0.compareTo(t.p0);
          return i !== 0 ? i : o.p1.compareTo(t.p1);
        } }, { key: "toString", value: function() {
          return this._upwardSeg.toString();
        } }, { key: "interfaces_", get: function() {
          return [$];
        } }], [{ key: "constructor_", value: function() {
          this._upwardSeg = null, this._leftDepth = null;
          var o = arguments[0], t = arguments[1];
          this._upwardSeg = new Lt(o), this._leftDepth = t;
        } }]);
      }();
      Dl.DepthSegment = Fl;
      var Gl = function(o) {
        function t() {
          var i;
          return u(this, t), i = s(this, t), t.constructor_.apply(i, arguments), i;
        }
        return _(t, o), h(t, null, [{ key: "constructor_", value: function() {
          V.constructor_.call(this, "Projective point not representable on the Cartesian plane.");
        } }]);
      }(V), ho = function() {
        function o() {
          u(this, o), o.constructor_.apply(this, arguments);
        }
        return h(o, [{ key: "getY", value: function() {
          var t = this.y / this.w;
          if (K.isNaN(t) || K.isInfinite(t)) throw new Gl();
          return t;
        } }, { key: "getX", value: function() {
          var t = this.x / this.w;
          if (K.isNaN(t) || K.isInfinite(t)) throw new Gl();
          return t;
        } }, { key: "getCoordinate", value: function() {
          var t = new J();
          return t.x = this.getX(), t.y = this.getY(), t;
        } }], [{ key: "constructor_", value: function() {
          if (this.x = null, this.y = null, this.w = null, arguments.length === 0) this.x = 0, this.y = 0, this.w = 1;
          else if (arguments.length === 1) {
            var t = arguments[0];
            this.x = t.x, this.y = t.y, this.w = 1;
          } else if (arguments.length === 2) {
            if (typeof arguments[0] == "number" && typeof arguments[1] == "number") {
              var i = arguments[0], a = arguments[1];
              this.x = i, this.y = a, this.w = 1;
            } else if (arguments[0] instanceof o && arguments[1] instanceof o) {
              var l = arguments[0], g = arguments[1];
              this.x = l.y * g.w - g.y * l.w, this.y = g.x * l.w - l.x * g.w, this.w = l.x * g.y - g.x * l.y;
            } else if (arguments[0] instanceof J && arguments[1] instanceof J) {
              var p = arguments[0], v = arguments[1];
              this.x = p.y - v.y, this.y = v.x - p.x, this.w = p.x * v.y - v.x * p.y;
            }
          } else if (arguments.length === 3) {
            var w = arguments[0], b = arguments[1], z = arguments[2];
            this.x = w, this.y = b, this.w = z;
          } else if (arguments.length === 4) {
            var W = arguments[0], Q = arguments[1], le = arguments[2], fe = arguments[3], ve = W.y - Q.y, Te = Q.x - W.x, Ie = W.x * Q.y - Q.x * W.y, Fe = le.y - fe.y, ot = fe.x - le.x, ct = le.x * fe.y - fe.x * le.y;
            this.x = Te * ct - ot * Ie, this.y = Fe * Ie - ve * ct, this.w = ve * ot - Fe * Te;
          }
        } }]);
      }(), rp = function() {
        function o() {
          u(this, o), o.constructor_.apply(this, arguments);
        }
        return h(o, [{ key: "area", value: function() {
          return o.area(this.p0, this.p1, this.p2);
        } }, { key: "signedArea", value: function() {
          return o.signedArea(this.p0, this.p1, this.p2);
        } }, { key: "interpolateZ", value: function(t) {
          if (t === null) throw new X("Supplied point is null.");
          return o.interpolateZ(t, this.p0, this.p1, this.p2);
        } }, { key: "longestSideLength", value: function() {
          return o.longestSideLength(this.p0, this.p1, this.p2);
        } }, { key: "isAcute", value: function() {
          return o.isAcute(this.p0, this.p1, this.p2);
        } }, { key: "circumcentre", value: function() {
          return o.circumcentre(this.p0, this.p1, this.p2);
        } }, { key: "area3D", value: function() {
          return o.area3D(this.p0, this.p1, this.p2);
        } }, { key: "centroid", value: function() {
          return o.centroid(this.p0, this.p1, this.p2);
        } }, { key: "inCentre", value: function() {
          return o.inCentre(this.p0, this.p1, this.p2);
        } }], [{ key: "constructor_", value: function() {
          this.p0 = null, this.p1 = null, this.p2 = null;
          var t = arguments[0], i = arguments[1], a = arguments[2];
          this.p0 = t, this.p1 = i, this.p2 = a;
        } }, { key: "area", value: function(t, i, a) {
          return Math.abs(((a.x - t.x) * (i.y - t.y) - (i.x - t.x) * (a.y - t.y)) / 2);
        } }, { key: "signedArea", value: function(t, i, a) {
          return ((a.x - t.x) * (i.y - t.y) - (i.x - t.x) * (a.y - t.y)) / 2;
        } }, { key: "det", value: function(t, i, a, l) {
          return t * l - i * a;
        } }, { key: "interpolateZ", value: function(t, i, a, l) {
          var g = i.x, p = i.y, v = a.x - g, w = l.x - g, b = a.y - p, z = l.y - p, W = v * z - w * b, Q = t.x - g, le = t.y - p, fe = (z * Q - w * le) / W, ve = (-b * Q + v * le) / W;
          return i.getZ() + fe * (a.getZ() - i.getZ()) + ve * (l.getZ() - i.getZ());
        } }, { key: "longestSideLength", value: function(t, i, a) {
          var l = t.distance(i), g = i.distance(a), p = a.distance(t), v = l;
          return g > v && (v = g), p > v && (v = p), v;
        } }, { key: "circumcentreDD", value: function(t, i, a) {
          var l = ye.valueOf(t.x).subtract(a.x), g = ye.valueOf(t.y).subtract(a.y), p = ye.valueOf(i.x).subtract(a.x), v = ye.valueOf(i.y).subtract(a.y), w = ye.determinant(l, g, p, v).multiply(2), b = l.sqr().add(g.sqr()), z = p.sqr().add(v.sqr()), W = ye.determinant(g, b, v, z), Q = ye.determinant(l, b, p, z), le = ye.valueOf(a.x).subtract(W.divide(w)).doubleValue(), fe = ye.valueOf(a.y).add(Q.divide(w)).doubleValue();
          return new J(le, fe);
        } }, { key: "isAcute", value: function(t, i, a) {
          return !!Ct.isAcute(t, i, a) && !!Ct.isAcute(i, a, t) && !!Ct.isAcute(a, t, i);
        } }, { key: "circumcentre", value: function(t, i, a) {
          var l = a.x, g = a.y, p = t.x - l, v = t.y - g, w = i.x - l, b = i.y - g, z = 2 * o.det(p, v, w, b), W = o.det(v, p * p + v * v, b, w * w + b * b), Q = o.det(p, p * p + v * v, w, w * w + b * b);
          return new J(l - W / z, g + Q / z);
        } }, { key: "perpendicularBisector", value: function(t, i) {
          var a = i.x - t.x, l = i.y - t.y, g = new ho(t.x + a / 2, t.y + l / 2, 1), p = new ho(t.x - l + a / 2, t.y + a + l / 2, 1);
          return new ho(g, p);
        } }, { key: "angleBisector", value: function(t, i, a) {
          var l = i.distance(t), g = l / (l + i.distance(a)), p = a.x - t.x, v = a.y - t.y;
          return new J(t.x + g * p, t.y + g * v);
        } }, { key: "area3D", value: function(t, i, a) {
          var l = i.x - t.x, g = i.y - t.y, p = i.getZ() - t.getZ(), v = a.x - t.x, w = a.y - t.y, b = a.getZ() - t.getZ(), z = g * b - p * w, W = p * v - l * b, Q = l * w - g * v, le = z * z + W * W + Q * Q, fe = Math.sqrt(le) / 2;
          return fe;
        } }, { key: "centroid", value: function(t, i, a) {
          var l = (t.x + i.x + a.x) / 3, g = (t.y + i.y + a.y) / 3;
          return new J(l, g);
        } }, { key: "inCentre", value: function(t, i, a) {
          var l = i.distance(a), g = t.distance(a), p = t.distance(i), v = l + g + p, w = (l * t.x + g * i.x + p * a.x) / v, b = (l * t.y + g * i.y + p * a.y) / v;
          return new J(w, b);
        } }]);
      }(), ip = function() {
        return h(function o() {
          u(this, o), o.constructor_.apply(this, arguments);
        }, [{ key: "addRingSide", value: function(o, t, i, a, l) {
          if (t === 0 && o.length < er.MINIMUM_VALID_SIZE) return null;
          var g = a, p = l;
          o.length >= er.MINIMUM_VALID_SIZE && _e.isCCW(o) && (g = l, p = a, i = ne.opposite(i));
          var v = this._curveBuilder.getRingCurve(o, i, t);
          this.addCurve(v, g, p);
        } }, { key: "addRingBothSides", value: function(o, t) {
          this.addRingSide(o, t, ne.LEFT, C.EXTERIOR, C.INTERIOR), this.addRingSide(o, t, ne.RIGHT, C.INTERIOR, C.EXTERIOR);
        } }, { key: "addPoint", value: function(o) {
          if (this._distance <= 0) return null;
          var t = o.getCoordinates(), i = this._curveBuilder.getLineCurve(t, this._distance);
          this.addCurve(i, C.EXTERIOR, C.INTERIOR);
        } }, { key: "addPolygon", value: function(o) {
          var t = this._distance, i = ne.LEFT;
          this._distance < 0 && (t = -this._distance, i = ne.RIGHT);
          var a = o.getExteriorRing(), l = oe.removeRepeatedPoints(a.getCoordinates());
          if (this._distance < 0 && this.isErodedCompletely(a, this._distance) || this._distance <= 0 && l.length < 3) return null;
          this.addRingSide(l, t, i, C.EXTERIOR, C.INTERIOR);
          for (var g = 0; g < o.getNumInteriorRing(); g++) {
            var p = o.getInteriorRingN(g), v = oe.removeRepeatedPoints(p.getCoordinates());
            this._distance > 0 && this.isErodedCompletely(p, -this._distance) || this.addRingSide(v, t, ne.opposite(i), C.INTERIOR, C.EXTERIOR);
          }
        } }, { key: "isTriangleErodedCompletely", value: function(o, t) {
          var i = new rp(o[0], o[1], o[2]), a = i.inCentre();
          return Ft.pointToSegment(a, i.p0, i.p1) < Math.abs(t);
        } }, { key: "addLineString", value: function(o) {
          if (this._curveBuilder.isLineOffsetEmpty(this._distance)) return null;
          var t = oe.removeRepeatedPoints(o.getCoordinates());
          if (oe.isRing(t) && !this._curveBuilder.getBufferParameters().isSingleSided()) this.addRingBothSides(t, this._distance);
          else {
            var i = this._curveBuilder.getLineCurve(t, this._distance);
            this.addCurve(i, C.EXTERIOR, C.INTERIOR);
          }
        } }, { key: "addCurve", value: function(o, t, i) {
          if (o === null || o.length < 2) return null;
          var a = new _r(o, new Ut(0, C.BOUNDARY, t, i));
          this._curveList.add(a);
        } }, { key: "getCurves", value: function() {
          return this.add(this._inputGeom), this._curveList;
        } }, { key: "add", value: function(o) {
          if (o.isEmpty()) return null;
          if (o instanceof vr) this.addPolygon(o);
          else if (o instanceof Qn) this.addLineString(o);
          else if (o instanceof Oi) this.addPoint(o);
          else if (o instanceof zr) this.addCollection(o);
          else if (o instanceof ro) this.addCollection(o);
          else if (o instanceof Pn) this.addCollection(o);
          else {
            if (!(o instanceof lt)) throw new Se(o.getGeometryType());
            this.addCollection(o);
          }
        } }, { key: "isErodedCompletely", value: function(o, t) {
          var i = o.getCoordinates();
          if (i.length < 4) return t < 0;
          if (i.length === 4) return this.isTriangleErodedCompletely(i, t);
          var a = o.getEnvelopeInternal(), l = Math.min(a.getHeight(), a.getWidth());
          return t < 0 && 2 * Math.abs(t) > l;
        } }, { key: "addCollection", value: function(o) {
          for (var t = 0; t < o.getNumGeometries(); t++) {
            var i = o.getGeometryN(t);
            this.add(i);
          }
        } }], [{ key: "constructor_", value: function() {
          this._inputGeom = null, this._distance = null, this._curveBuilder = null, this._curveList = new me();
          var o = arguments[0], t = arguments[1], i = arguments[2];
          this._inputGeom = o, this._distance = t, this._curveBuilder = i;
        } }]);
      }(), sp = function() {
        return h(function o() {
          u(this, o);
        }, [{ key: "locate", value: function(o) {
        } }]);
      }(), ap = function() {
        function o() {
          u(this, o), o.constructor_.apply(this, arguments);
        }
        return h(o, [{ key: "next", value: function() {
          if (this._atStart) return this._atStart = !1, o.isAtomic(this._parent) && this._index++, this._parent;
          if (this._subcollectionIterator !== null) {
            if (this._subcollectionIterator.hasNext()) return this._subcollectionIterator.next();
            this._subcollectionIterator = null;
          }
          if (this._index >= this._max) throw new Oe();
          var t = this._parent.getGeometryN(this._index++);
          return t instanceof lt ? (this._subcollectionIterator = new o(t), this._subcollectionIterator.next()) : t;
        } }, { key: "remove", value: function() {
          throw new Se(this.getClass().getName());
        } }, { key: "hasNext", value: function() {
          if (this._atStart) return !0;
          if (this._subcollectionIterator !== null) {
            if (this._subcollectionIterator.hasNext()) return !0;
            this._subcollectionIterator = null;
          }
          return !(this._index >= this._max);
        } }, { key: "interfaces_", get: function() {
          return [Zd];
        } }], [{ key: "constructor_", value: function() {
          this._parent = null, this._atStart = null, this._max = null, this._index = null, this._subcollectionIterator = null;
          var t = arguments[0];
          this._parent = t, this._atStart = !0, this._index = 0, this._max = t.getNumGeometries();
        } }, { key: "isAtomic", value: function(t) {
          return !(t instanceof lt);
        } }]);
      }(), op = function() {
        function o() {
          u(this, o), o.constructor_.apply(this, arguments);
        }
        return h(o, [{ key: "locate", value: function(t) {
          return o.locate(t, this._geom);
        } }, { key: "interfaces_", get: function() {
          return [sp];
        } }], [{ key: "constructor_", value: function() {
          this._geom = null;
          var t = arguments[0];
          this._geom = t;
        } }, { key: "locatePointInPolygon", value: function(t, i) {
          if (i.isEmpty()) return C.EXTERIOR;
          var a = i.getExteriorRing(), l = o.locatePointInRing(t, a);
          if (l !== C.INTERIOR) return l;
          for (var g = 0; g < i.getNumInteriorRing(); g++) {
            var p = i.getInteriorRingN(g), v = o.locatePointInRing(t, p);
            if (v === C.BOUNDARY) return C.BOUNDARY;
            if (v === C.INTERIOR) return C.EXTERIOR;
          }
          return C.INTERIOR;
        } }, { key: "locatePointInRing", value: function(t, i) {
          return i.getEnvelopeInternal().intersects(t) ? ao.locateInRing(t, i.getCoordinates()) : C.EXTERIOR;
        } }, { key: "containsPointInPolygon", value: function(t, i) {
          return C.EXTERIOR !== o.locatePointInPolygon(t, i);
        } }, { key: "locateInGeometry", value: function(t, i) {
          if (i instanceof vr) return o.locatePointInPolygon(t, i);
          if (i instanceof lt) for (var a = new ap(i); a.hasNext(); ) {
            var l = a.next();
            if (l !== i) {
              var g = o.locateInGeometry(t, l);
              if (g !== C.EXTERIOR) return g;
            }
          }
          return C.EXTERIOR;
        } }, { key: "isContained", value: function(t, i) {
          return C.EXTERIOR !== o.locate(t, i);
        } }, { key: "locate", value: function(t, i) {
          return i.isEmpty() ? C.EXTERIOR : i.getEnvelopeInternal().intersects(t) ? o.locateInGeometry(t, i) : C.EXTERIOR;
        } }]);
      }(), up = function() {
        return h(function o() {
          u(this, o), o.constructor_.apply(this, arguments);
        }, [{ key: "getNextCW", value: function(o) {
          this.getEdges();
          var t = this._edgeList.indexOf(o), i = t - 1;
          return t === 0 && (i = this._edgeList.size() - 1), this._edgeList.get(i);
        } }, { key: "propagateSideLabels", value: function(o) {
          for (var t = C.NONE, i = this.iterator(); i.hasNext(); ) {
            var a = i.next().getLabel();
            a.isArea(o) && a.getLocation(o, ne.LEFT) !== C.NONE && (t = a.getLocation(o, ne.LEFT));
          }
          if (t === C.NONE) return null;
          for (var l = t, g = this.iterator(); g.hasNext(); ) {
            var p = g.next(), v = p.getLabel();
            if (v.getLocation(o, ne.ON) === C.NONE && v.setLocation(o, ne.ON, l), v.isArea(o)) {
              var w = v.getLocation(o, ne.LEFT), b = v.getLocation(o, ne.RIGHT);
              if (b !== C.NONE) {
                if (b !== l) throw new xt("side location conflict", p.getCoordinate());
                w === C.NONE && se.shouldNeverReachHere("found single null side (at " + p.getCoordinate() + ")"), l = w;
              } else se.isTrue(v.getLocation(o, ne.LEFT) === C.NONE, "found single null side"), v.setLocation(o, ne.RIGHT, l), v.setLocation(o, ne.LEFT, l);
            }
          }
        } }, { key: "getCoordinate", value: function() {
          var o = this.iterator();
          return o.hasNext() ? o.next().getCoordinate() : null;
        } }, { key: "print", value: function(o) {
          at.out.println("EdgeEndStar:   " + this.getCoordinate());
          for (var t = this.iterator(); t.hasNext(); )
            t.next().print(o);
        } }, { key: "isAreaLabelsConsistent", value: function(o) {
          return this.computeEdgeEndLabels(o.getBoundaryNodeRule()), this.checkAreaLabelsConsistent(0);
        } }, { key: "checkAreaLabelsConsistent", value: function(o) {
          var t = this.getEdges();
          if (t.size() <= 0) return !0;
          var i = t.size() - 1, a = t.get(i).getLabel().getLocation(o, ne.LEFT);
          se.isTrue(a !== C.NONE, "Found unlabelled area edge");
          for (var l = a, g = this.iterator(); g.hasNext(); ) {
            var p = g.next().getLabel();
            se.isTrue(p.isArea(o), "Found non-area edge");
            var v = p.getLocation(o, ne.LEFT), w = p.getLocation(o, ne.RIGHT);
            if (v === w || w !== l) return !1;
            l = v;
          }
          return !0;
        } }, { key: "findIndex", value: function(o) {
          this.iterator();
          for (var t = 0; t < this._edgeList.size(); t++)
            if (this._edgeList.get(t) === o) return t;
          return -1;
        } }, { key: "iterator", value: function() {
          return this.getEdges().iterator();
        } }, { key: "getEdges", value: function() {
          return this._edgeList === null && (this._edgeList = new me(this._edgeMap.values())), this._edgeList;
        } }, { key: "getLocation", value: function(o, t, i) {
          return this._ptInAreaLocation[o] === C.NONE && (this._ptInAreaLocation[o] = op.locate(t, i[o].getGeometry())), this._ptInAreaLocation[o];
        } }, { key: "toString", value: function() {
          var o = new Dt();
          o.append("EdgeEndStar:   " + this.getCoordinate()), o.append(`
`);
          for (var t = this.iterator(); t.hasNext(); ) {
            var i = t.next();
            o.append(i), o.append(`
`);
          }
          return o.toString();
        } }, { key: "computeEdgeEndLabels", value: function(o) {
          for (var t = this.iterator(); t.hasNext(); )
            t.next().computeLabel(o);
        } }, { key: "computeLabelling", value: function(o) {
          this.computeEdgeEndLabels(o[0].getBoundaryNodeRule()), this.propagateSideLabels(0), this.propagateSideLabels(1);
          for (var t = [!1, !1], i = this.iterator(); i.hasNext(); ) for (var a = i.next().getLabel(), l = 0; l < 2; l++) a.isLine(l) && a.getLocation(l) === C.BOUNDARY && (t[l] = !0);
          for (var g = this.iterator(); g.hasNext(); ) for (var p = g.next(), v = p.getLabel(), w = 0; w < 2; w++) if (v.isAnyNull(w)) {
            var b = C.NONE;
            if (t[w]) b = C.EXTERIOR;
            else {
              var z = p.getCoordinate();
              b = this.getLocation(w, z, o);
            }
            v.setAllLocationsIfNull(w, b);
          }
        } }, { key: "getDegree", value: function() {
          return this._edgeMap.size();
        } }, { key: "insertEdgeEnd", value: function(o, t) {
          this._edgeMap.put(o, t), this._edgeList = null;
        } }], [{ key: "constructor_", value: function() {
          this._edgeMap = new Gi(), this._edgeList = null, this._ptInAreaLocation = [C.NONE, C.NONE];
        } }]);
      }(), lp = function(o) {
        function t() {
          var i;
          return u(this, t), i = s(this, t), t.constructor_.apply(i, arguments), i;
        }
        return _(t, o), h(t, [{ key: "linkResultDirectedEdges", value: function() {
          this.getResultAreaEdges();
          for (var i = null, a = null, l = this._SCANNING_FOR_INCOMING, g = 0; g < this._resultAreaEdgeList.size(); g++) {
            var p = this._resultAreaEdgeList.get(g), v = p.getSym();
            if (p.getLabel().isArea()) switch (i === null && p.isInResult() && (i = p), l) {
              case this._SCANNING_FOR_INCOMING:
                if (!v.isInResult()) continue;
                a = v, l = this._LINKING_TO_OUTGOING;
                break;
              case this._LINKING_TO_OUTGOING:
                if (!p.isInResult()) continue;
                a.setNext(p), l = this._SCANNING_FOR_INCOMING;
            }
          }
          if (l === this._LINKING_TO_OUTGOING) {
            if (i === null) throw new xt("no outgoing dirEdge found", this.getCoordinate());
            se.isTrue(i.isInResult(), "unable to link last incoming dirEdge"), a.setNext(i);
          }
        } }, { key: "insert", value: function(i) {
          var a = i;
          this.insertEdgeEnd(a, a);
        } }, { key: "getRightmostEdge", value: function() {
          var i = this.getEdges(), a = i.size();
          if (a < 1) return null;
          var l = i.get(0);
          if (a === 1) return l;
          var g = i.get(a - 1), p = l.getQuadrant(), v = g.getQuadrant();
          return gt.isNorthern(p) && gt.isNorthern(v) ? l : gt.isNorthern(p) || gt.isNorthern(v) ? l.getDy() !== 0 ? l : g.getDy() !== 0 ? g : (se.shouldNeverReachHere("found two horizontal edges incident on node"), null) : g;
        } }, { key: "print", value: function(i) {
          at.out.println("DirectedEdgeStar: " + this.getCoordinate());
          for (var a = this.iterator(); a.hasNext(); ) {
            var l = a.next();
            i.print("out "), l.print(i), i.println(), i.print("in "), l.getSym().print(i), i.println();
          }
        } }, { key: "getResultAreaEdges", value: function() {
          if (this._resultAreaEdgeList !== null) return this._resultAreaEdgeList;
          this._resultAreaEdgeList = new me();
          for (var i = this.iterator(); i.hasNext(); ) {
            var a = i.next();
            (a.isInResult() || a.getSym().isInResult()) && this._resultAreaEdgeList.add(a);
          }
          return this._resultAreaEdgeList;
        } }, { key: "updateLabelling", value: function(i) {
          for (var a = this.iterator(); a.hasNext(); ) {
            var l = a.next().getLabel();
            l.setAllLocationsIfNull(0, i.getLocation(0)), l.setAllLocationsIfNull(1, i.getLocation(1));
          }
        } }, { key: "linkAllDirectedEdges", value: function() {
          this.getEdges();
          for (var i = null, a = null, l = this._edgeList.size() - 1; l >= 0; l--) {
            var g = this._edgeList.get(l), p = g.getSym();
            a === null && (a = p), i !== null && p.setNext(i), i = g;
          }
          a.setNext(i);
        } }, { key: "computeDepths", value: function() {
          if (arguments.length === 1) {
            var i = arguments[0], a = this.findIndex(i), l = i.getDepth(ne.LEFT), g = i.getDepth(ne.RIGHT), p = this.computeDepths(a + 1, this._edgeList.size(), l);
            if (this.computeDepths(0, a, p) !== g) throw new xt("depth mismatch at " + i.getCoordinate());
          } else if (arguments.length === 3) {
            for (var v = arguments[1], w = arguments[2], b = arguments[0]; b < v; b++) {
              var z = this._edgeList.get(b);
              z.setEdgeDepths(ne.RIGHT, w), w = z.getDepth(ne.LEFT);
            }
            return w;
          }
        } }, { key: "mergeSymLabels", value: function() {
          for (var i = this.iterator(); i.hasNext(); ) {
            var a = i.next();
            a.getLabel().merge(a.getSym().getLabel());
          }
        } }, { key: "linkMinimalDirectedEdges", value: function(i) {
          for (var a = null, l = null, g = this._SCANNING_FOR_INCOMING, p = this._resultAreaEdgeList.size() - 1; p >= 0; p--) {
            var v = this._resultAreaEdgeList.get(p), w = v.getSym();
            switch (a === null && v.getEdgeRing() === i && (a = v), g) {
              case this._SCANNING_FOR_INCOMING:
                if (w.getEdgeRing() !== i) continue;
                l = w, g = this._LINKING_TO_OUTGOING;
                break;
              case this._LINKING_TO_OUTGOING:
                if (v.getEdgeRing() !== i) continue;
                l.setNextMin(v), g = this._SCANNING_FOR_INCOMING;
            }
          }
          g === this._LINKING_TO_OUTGOING && (se.isTrue(a !== null, "found null for first outgoing dirEdge"), se.isTrue(a.getEdgeRing() === i, "unable to link last incoming dirEdge"), l.setNextMin(a));
        } }, { key: "getOutgoingDegree", value: function() {
          if (arguments.length === 0) {
            for (var i = 0, a = this.iterator(); a.hasNext(); )
              a.next().isInResult() && i++;
            return i;
          }
          if (arguments.length === 1) {
            for (var l = arguments[0], g = 0, p = this.iterator(); p.hasNext(); )
              p.next().getEdgeRing() === l && g++;
            return g;
          }
        } }, { key: "getLabel", value: function() {
          return this._label;
        } }, { key: "findCoveredLineEdges", value: function() {
          for (var i = C.NONE, a = this.iterator(); a.hasNext(); ) {
            var l = a.next(), g = l.getSym();
            if (!l.isLineEdge()) {
              if (l.isInResult()) {
                i = C.INTERIOR;
                break;
              }
              if (g.isInResult()) {
                i = C.EXTERIOR;
                break;
              }
            }
          }
          if (i === C.NONE) return null;
          for (var p = i, v = this.iterator(); v.hasNext(); ) {
            var w = v.next(), b = w.getSym();
            w.isLineEdge() ? w.getEdge().setCovered(p === C.INTERIOR) : (w.isInResult() && (p = C.EXTERIOR), b.isInResult() && (p = C.INTERIOR));
          }
        } }, { key: "computeLabelling", value: function(i) {
          I(t, "computeLabelling", this, 1).call(this, i), this._label = new Ut(C.NONE);
          for (var a = this.iterator(); a.hasNext(); ) for (var l = a.next().getEdge().getLabel(), g = 0; g < 2; g++) {
            var p = l.getLocation(g);
            p !== C.INTERIOR && p !== C.BOUNDARY || this._label.setLocation(g, C.INTERIOR);
          }
        } }], [{ key: "constructor_", value: function() {
          this._resultAreaEdgeList = null, this._label = null, this._SCANNING_FOR_INCOMING = 1, this._LINKING_TO_OUTGOING = 2;
        } }]);
      }(up), cp = function(o) {
        function t() {
          return u(this, t), s(this, t);
        }
        return _(t, o), h(t, [{ key: "createNode", value: function(i) {
          return new As(i, new lp());
        } }]);
      }(bl), Bl = function() {
        function o() {
          u(this, o), o.constructor_.apply(this, arguments);
        }
        return h(o, [{ key: "compareTo", value: function(t) {
          var i = t;
          return o.compareOriented(this._pts, this._orientation, i._pts, i._orientation);
        } }, { key: "interfaces_", get: function() {
          return [$];
        } }], [{ key: "constructor_", value: function() {
          this._pts = null, this._orientation = null;
          var t = arguments[0];
          this._pts = t, this._orientation = o.orientation(t);
        } }, { key: "orientation", value: function(t) {
          return oe.increasingDirection(t) === 1;
        } }, { key: "compareOriented", value: function(t, i, a, l) {
          for (var g = i ? 1 : -1, p = l ? 1 : -1, v = i ? t.length : -1, w = l ? a.length : -1, b = i ? 0 : t.length - 1, z = l ? 0 : a.length - 1; ; ) {
            var W = t[b].compareTo(a[z]);
            if (W !== 0) return W;
            var Q = (b += g) === v, le = (z += p) === w;
            if (Q && !le) return -1;
            if (!Q && le) return 1;
            if (Q && le) return 0;
          }
        } }]);
      }(), hp = function() {
        return h(function o() {
          u(this, o), o.constructor_.apply(this, arguments);
        }, [{ key: "print", value: function(o) {
          o.print("MULTILINESTRING ( ");
          for (var t = 0; t < this._edges.size(); t++) {
            var i = this._edges.get(t);
            t > 0 && o.print(","), o.print("(");
            for (var a = i.getCoordinates(), l = 0; l < a.length; l++) l > 0 && o.print(","), o.print(a[l].x + " " + a[l].y);
            o.println(")");
          }
          o.print(")  ");
        } }, { key: "addAll", value: function(o) {
          for (var t = o.iterator(); t.hasNext(); ) this.add(t.next());
        } }, { key: "findEdgeIndex", value: function(o) {
          for (var t = 0; t < this._edges.size(); t++) if (this._edges.get(t).equals(o)) return t;
          return -1;
        } }, { key: "iterator", value: function() {
          return this._edges.iterator();
        } }, { key: "getEdges", value: function() {
          return this._edges;
        } }, { key: "get", value: function(o) {
          return this._edges.get(o);
        } }, { key: "findEqualEdge", value: function(o) {
          var t = new Bl(o.getCoordinates());
          return this._ocaMap.get(t);
        } }, { key: "add", value: function(o) {
          this._edges.add(o);
          var t = new Bl(o.getCoordinates());
          this._ocaMap.put(t, o);
        } }], [{ key: "constructor_", value: function() {
          this._edges = new me(), this._ocaMap = new Gi();
        } }]);
      }(), Ul = function() {
        return h(function o() {
          u(this, o);
        }, [{ key: "processIntersections", value: function(o, t, i, a) {
        } }, { key: "isDone", value: function() {
        } }]);
      }(), fp = function() {
        function o() {
          u(this, o), o.constructor_.apply(this, arguments);
        }
        return h(o, [{ key: "isTrivialIntersection", value: function(t, i, a, l) {
          if (t === a && this._li.getIntersectionNum() === 1) {
            if (o.isAdjacentSegments(i, l)) return !0;
            if (t.isClosed()) {
              var g = t.size() - 1;
              if (i === 0 && l === g || l === 0 && i === g) return !0;
            }
          }
          return !1;
        } }, { key: "getProperIntersectionPoint", value: function() {
          return this._properIntersectionPoint;
        } }, { key: "hasProperInteriorIntersection", value: function() {
          return this._hasProperInterior;
        } }, { key: "getLineIntersector", value: function() {
          return this._li;
        } }, { key: "hasProperIntersection", value: function() {
          return this._hasProper;
        } }, { key: "processIntersections", value: function(t, i, a, l) {
          if (t === a && i === l) return null;
          this.numTests++;
          var g = t.getCoordinates()[i], p = t.getCoordinates()[i + 1], v = a.getCoordinates()[l], w = a.getCoordinates()[l + 1];
          this._li.computeIntersection(g, p, v, w), this._li.hasIntersection() && (this.numIntersections++, this._li.isInteriorIntersection() && (this.numInteriorIntersections++, this._hasInterior = !0), this.isTrivialIntersection(t, i, a, l) || (this._hasIntersection = !0, t.addIntersections(this._li, i, 0), a.addIntersections(this._li, l, 1), this._li.isProper() && (this.numProperIntersections++, this._hasProper = !0, this._hasProperInterior = !0)));
        } }, { key: "hasIntersection", value: function() {
          return this._hasIntersection;
        } }, { key: "isDone", value: function() {
          return !1;
        } }, { key: "hasInteriorIntersection", value: function() {
          return this._hasInterior;
        } }, { key: "interfaces_", get: function() {
          return [Ul];
        } }], [{ key: "constructor_", value: function() {
          this._hasIntersection = !1, this._hasProper = !1, this._hasProperInterior = !1, this._hasInterior = !1, this._properIntersectionPoint = null, this._li = null, this._isSelfIntersection = null, this.numIntersections = 0, this.numInteriorIntersections = 0, this.numProperIntersections = 0, this.numTests = 0;
          var t = arguments[0];
          this._li = t;
        } }, { key: "isAdjacentSegments", value: function(t, i) {
          return Math.abs(t - i) === 1;
        } }]);
      }(), gp = function() {
        return h(function o() {
          u(this, o), o.constructor_.apply(this, arguments);
        }, [{ key: "getSegmentIndex", value: function() {
          return this.segmentIndex;
        } }, { key: "getCoordinate", value: function() {
          return this.coord;
        } }, { key: "print", value: function(o) {
          o.print(this.coord), o.print(" seg # = " + this.segmentIndex), o.println(" dist = " + this.dist);
        } }, { key: "compareTo", value: function(o) {
          var t = o;
          return this.compare(t.segmentIndex, t.dist);
        } }, { key: "isEndPoint", value: function(o) {
          return this.segmentIndex === 0 && this.dist === 0 || this.segmentIndex === o;
        } }, { key: "toString", value: function() {
          return this.coord + " seg # = " + this.segmentIndex + " dist = " + this.dist;
        } }, { key: "getDistance", value: function() {
          return this.dist;
        } }, { key: "compare", value: function(o, t) {
          return this.segmentIndex < o ? -1 : this.segmentIndex > o ? 1 : this.dist < t ? -1 : this.dist > t ? 1 : 0;
        } }, { key: "interfaces_", get: function() {
          return [$];
        } }], [{ key: "constructor_", value: function() {
          this.coord = null, this.segmentIndex = null, this.dist = null;
          var o = arguments[0], t = arguments[1], i = arguments[2];
          this.coord = new J(o), this.segmentIndex = t, this.dist = i;
        } }]);
      }(), dp = function() {
        return h(function o() {
          u(this, o), o.constructor_.apply(this, arguments);
        }, [{ key: "print", value: function(o) {
          o.println("Intersections:");
          for (var t = this.iterator(); t.hasNext(); )
            t.next().print(o);
        } }, { key: "iterator", value: function() {
          return this._nodeMap.values().iterator();
        } }, { key: "addSplitEdges", value: function(o) {
          this.addEndpoints();
          for (var t = this.iterator(), i = t.next(); t.hasNext(); ) {
            var a = t.next(), l = this.createSplitEdge(i, a);
            o.add(l), i = a;
          }
        } }, { key: "addEndpoints", value: function() {
          var o = this.edge.pts.length - 1;
          this.add(this.edge.pts[0], 0, 0), this.add(this.edge.pts[o], o, 0);
        } }, { key: "createSplitEdge", value: function(o, t) {
          var i = t.segmentIndex - o.segmentIndex + 2, a = this.edge.pts[t.segmentIndex], l = t.dist > 0 || !t.coord.equals2D(a);
          l || i--;
          var g = new Array(i).fill(null), p = 0;
          g[p++] = new J(o.coord);
          for (var v = o.segmentIndex + 1; v <= t.segmentIndex; v++) g[p++] = this.edge.pts[v];
          return l && (g[p] = t.coord), new ql(g, new Ut(this.edge._label));
        } }, { key: "add", value: function(o, t, i) {
          var a = new gp(o, t, i), l = this._nodeMap.get(a);
          return l !== null ? l : (this._nodeMap.put(a, a), a);
        } }, { key: "isIntersection", value: function(o) {
          for (var t = this.iterator(); t.hasNext(); )
            if (t.next().coord.equals(o)) return !0;
          return !1;
        } }], [{ key: "constructor_", value: function() {
          this._nodeMap = new Gi(), this.edge = null;
          var o = arguments[0];
          this.edge = o;
        } }]);
      }(), pp = function() {
        function o() {
          u(this, o), o.constructor_.apply(this, arguments);
        }
        return h(o, [{ key: "isIntersects", value: function() {
          return !this.isDisjoint();
        } }, { key: "isCovers", value: function() {
          return (o.isTrue(this._matrix[C.INTERIOR][C.INTERIOR]) || o.isTrue(this._matrix[C.INTERIOR][C.BOUNDARY]) || o.isTrue(this._matrix[C.BOUNDARY][C.INTERIOR]) || o.isTrue(this._matrix[C.BOUNDARY][C.BOUNDARY])) && this._matrix[C.EXTERIOR][C.INTERIOR] === ie.FALSE && this._matrix[C.EXTERIOR][C.BOUNDARY] === ie.FALSE;
        } }, { key: "isCoveredBy", value: function() {
          return (o.isTrue(this._matrix[C.INTERIOR][C.INTERIOR]) || o.isTrue(this._matrix[C.INTERIOR][C.BOUNDARY]) || o.isTrue(this._matrix[C.BOUNDARY][C.INTERIOR]) || o.isTrue(this._matrix[C.BOUNDARY][C.BOUNDARY])) && this._matrix[C.INTERIOR][C.EXTERIOR] === ie.FALSE && this._matrix[C.BOUNDARY][C.EXTERIOR] === ie.FALSE;
        } }, { key: "set", value: function() {
          if (arguments.length === 1) for (var t = arguments[0], i = 0; i < t.length; i++) {
            var a = Math.trunc(i / 3), l = i % 3;
            this._matrix[a][l] = ie.toDimensionValue(t.charAt(i));
          }
          else if (arguments.length === 3) {
            var g = arguments[0], p = arguments[1], v = arguments[2];
            this._matrix[g][p] = v;
          }
        } }, { key: "isContains", value: function() {
          return o.isTrue(this._matrix[C.INTERIOR][C.INTERIOR]) && this._matrix[C.EXTERIOR][C.INTERIOR] === ie.FALSE && this._matrix[C.EXTERIOR][C.BOUNDARY] === ie.FALSE;
        } }, { key: "setAtLeast", value: function() {
          if (arguments.length === 1) for (var t = arguments[0], i = 0; i < t.length; i++) {
            var a = Math.trunc(i / 3), l = i % 3;
            this.setAtLeast(a, l, ie.toDimensionValue(t.charAt(i)));
          }
          else if (arguments.length === 3) {
            var g = arguments[0], p = arguments[1], v = arguments[2];
            this._matrix[g][p] < v && (this._matrix[g][p] = v);
          }
        } }, { key: "setAtLeastIfValid", value: function(t, i, a) {
          t >= 0 && i >= 0 && this.setAtLeast(t, i, a);
        } }, { key: "isWithin", value: function() {
          return o.isTrue(this._matrix[C.INTERIOR][C.INTERIOR]) && this._matrix[C.INTERIOR][C.EXTERIOR] === ie.FALSE && this._matrix[C.BOUNDARY][C.EXTERIOR] === ie.FALSE;
        } }, { key: "isTouches", value: function(t, i) {
          return t > i ? this.isTouches(i, t) : (t === ie.A && i === ie.A || t === ie.L && i === ie.L || t === ie.L && i === ie.A || t === ie.P && i === ie.A || t === ie.P && i === ie.L) && this._matrix[C.INTERIOR][C.INTERIOR] === ie.FALSE && (o.isTrue(this._matrix[C.INTERIOR][C.BOUNDARY]) || o.isTrue(this._matrix[C.BOUNDARY][C.INTERIOR]) || o.isTrue(this._matrix[C.BOUNDARY][C.BOUNDARY]));
        } }, { key: "isOverlaps", value: function(t, i) {
          return t === ie.P && i === ie.P || t === ie.A && i === ie.A ? o.isTrue(this._matrix[C.INTERIOR][C.INTERIOR]) && o.isTrue(this._matrix[C.INTERIOR][C.EXTERIOR]) && o.isTrue(this._matrix[C.EXTERIOR][C.INTERIOR]) : t === ie.L && i === ie.L && this._matrix[C.INTERIOR][C.INTERIOR] === 1 && o.isTrue(this._matrix[C.INTERIOR][C.EXTERIOR]) && o.isTrue(this._matrix[C.EXTERIOR][C.INTERIOR]);
        } }, { key: "isEquals", value: function(t, i) {
          return t === i && o.isTrue(this._matrix[C.INTERIOR][C.INTERIOR]) && this._matrix[C.INTERIOR][C.EXTERIOR] === ie.FALSE && this._matrix[C.BOUNDARY][C.EXTERIOR] === ie.FALSE && this._matrix[C.EXTERIOR][C.INTERIOR] === ie.FALSE && this._matrix[C.EXTERIOR][C.BOUNDARY] === ie.FALSE;
        } }, { key: "toString", value: function() {
          for (var t = new We("123456789"), i = 0; i < 3; i++) for (var a = 0; a < 3; a++) t.setCharAt(3 * i + a, ie.toDimensionSymbol(this._matrix[i][a]));
          return t.toString();
        } }, { key: "setAll", value: function(t) {
          for (var i = 0; i < 3; i++) for (var a = 0; a < 3; a++) this._matrix[i][a] = t;
        } }, { key: "get", value: function(t, i) {
          return this._matrix[t][i];
        } }, { key: "transpose", value: function() {
          var t = this._matrix[1][0];
          return this._matrix[1][0] = this._matrix[0][1], this._matrix[0][1] = t, t = this._matrix[2][0], this._matrix[2][0] = this._matrix[0][2], this._matrix[0][2] = t, t = this._matrix[2][1], this._matrix[2][1] = this._matrix[1][2], this._matrix[1][2] = t, this;
        } }, { key: "matches", value: function(t) {
          if (t.length !== 9) throw new X("Should be length 9: " + t);
          for (var i = 0; i < 3; i++) for (var a = 0; a < 3; a++) if (!o.matches(this._matrix[i][a], t.charAt(3 * i + a))) return !1;
          return !0;
        } }, { key: "add", value: function(t) {
          for (var i = 0; i < 3; i++) for (var a = 0; a < 3; a++) this.setAtLeast(i, a, t.get(i, a));
        } }, { key: "isDisjoint", value: function() {
          return this._matrix[C.INTERIOR][C.INTERIOR] === ie.FALSE && this._matrix[C.INTERIOR][C.BOUNDARY] === ie.FALSE && this._matrix[C.BOUNDARY][C.INTERIOR] === ie.FALSE && this._matrix[C.BOUNDARY][C.BOUNDARY] === ie.FALSE;
        } }, { key: "isCrosses", value: function(t, i) {
          return t === ie.P && i === ie.L || t === ie.P && i === ie.A || t === ie.L && i === ie.A ? o.isTrue(this._matrix[C.INTERIOR][C.INTERIOR]) && o.isTrue(this._matrix[C.INTERIOR][C.EXTERIOR]) : t === ie.L && i === ie.P || t === ie.A && i === ie.P || t === ie.A && i === ie.L ? o.isTrue(this._matrix[C.INTERIOR][C.INTERIOR]) && o.isTrue(this._matrix[C.EXTERIOR][C.INTERIOR]) : t === ie.L && i === ie.L && this._matrix[C.INTERIOR][C.INTERIOR] === 0;
        } }, { key: "interfaces_", get: function() {
          return [x];
        } }], [{ key: "constructor_", value: function() {
          if (this._matrix = null, arguments.length === 0) this._matrix = Array(3).fill().map(function() {
            return Array(3);
          }), this.setAll(ie.FALSE);
          else if (arguments.length === 1) {
            if (typeof arguments[0] == "string") {
              var t = arguments[0];
              o.constructor_.call(this), this.set(t);
            } else if (arguments[0] instanceof o) {
              var i = arguments[0];
              o.constructor_.call(this), this._matrix[C.INTERIOR][C.INTERIOR] = i._matrix[C.INTERIOR][C.INTERIOR], this._matrix[C.INTERIOR][C.BOUNDARY] = i._matrix[C.INTERIOR][C.BOUNDARY], this._matrix[C.INTERIOR][C.EXTERIOR] = i._matrix[C.INTERIOR][C.EXTERIOR], this._matrix[C.BOUNDARY][C.INTERIOR] = i._matrix[C.BOUNDARY][C.INTERIOR], this._matrix[C.BOUNDARY][C.BOUNDARY] = i._matrix[C.BOUNDARY][C.BOUNDARY], this._matrix[C.BOUNDARY][C.EXTERIOR] = i._matrix[C.BOUNDARY][C.EXTERIOR], this._matrix[C.EXTERIOR][C.INTERIOR] = i._matrix[C.EXTERIOR][C.INTERIOR], this._matrix[C.EXTERIOR][C.BOUNDARY] = i._matrix[C.EXTERIOR][C.BOUNDARY], this._matrix[C.EXTERIOR][C.EXTERIOR] = i._matrix[C.EXTERIOR][C.EXTERIOR];
            }
          }
        } }, { key: "matches", value: function() {
          if (Number.isInteger(arguments[0]) && typeof arguments[1] == "string") {
            var t = arguments[0], i = arguments[1];
            return i === ie.SYM_DONTCARE || i === ie.SYM_TRUE && (t >= 0 || t === ie.TRUE) || i === ie.SYM_FALSE && t === ie.FALSE || i === ie.SYM_P && t === ie.P || i === ie.SYM_L && t === ie.L || i === ie.SYM_A && t === ie.A;
          }
          if (typeof arguments[0] == "string" && typeof arguments[1] == "string") {
            var a = arguments[1];
            return new o(arguments[0]).matches(a);
          }
        } }, { key: "isTrue", value: function(t) {
          return t >= 0 || t === ie.TRUE;
        } }]);
      }(), mp = function() {
        function o() {
          u(this, o), o.constructor_.apply(this, arguments);
        }
        return h(o, [{ key: "size", value: function() {
          return this._size;
        } }, { key: "addAll", value: function(t) {
          return t === null || t.length === 0 ? null : (this.ensureCapacity(this._size + t.length), at.arraycopy(t, 0, this._data, this._size, t.length), void (this._size += t.length));
        } }, { key: "ensureCapacity", value: function(t) {
          if (t <= this._data.length) return null;
          var i = Math.max(t, 2 * this._data.length);
          this._data = Gt.copyOf(this._data, i);
        } }, { key: "toArray", value: function() {
          var t = new Array(this._size).fill(null);
          return at.arraycopy(this._data, 0, t, 0, this._size), t;
        } }, { key: "add", value: function(t) {
          this.ensureCapacity(this._size + 1), this._data[this._size] = t, ++this._size;
        } }], [{ key: "constructor_", value: function() {
          if (this._data = null, this._size = 0, arguments.length === 0) o.constructor_.call(this, 10);
          else if (arguments.length === 1) {
            var t = arguments[0];
            this._data = new Array(t).fill(null);
          }
        } }]);
      }(), vp = function() {
        function o() {
          u(this, o);
        }
        return h(o, [{ key: "getChainStartIndices", value: function(t) {
          var i = 0, a = new mp(Math.trunc(t.length / 2));
          a.add(i);
          do {
            var l = this.findChainEnd(t, i);
            a.add(l), i = l;
          } while (i < t.length - 1);
          return a.toArray();
        } }, { key: "findChainEnd", value: function(t, i) {
          for (var a = gt.quadrant(t[i], t[i + 1]), l = i + 1; l < t.length && gt.quadrant(t[l - 1], t[l]) === a; )
            l++;
          return l - 1;
        } }, { key: "OLDgetChainStartIndices", value: function(t) {
          var i = 0, a = new me();
          a.add(i);
          do {
            var l = this.findChainEnd(t, i);
            a.add(l), i = l;
          } while (i < t.length - 1);
          return o.toIntArray(a);
        } }], [{ key: "toIntArray", value: function(t) {
          for (var i = new Array(t.size()).fill(null), a = 0; a < i.length; a++) i[a] = t.get(a).intValue();
          return i;
        } }]);
      }(), yp = function() {
        return h(function o() {
          u(this, o), o.constructor_.apply(this, arguments);
        }, [{ key: "getCoordinates", value: function() {
          return this.pts;
        } }, { key: "getMaxX", value: function(o) {
          var t = this.pts[this.startIndex[o]].x, i = this.pts[this.startIndex[o + 1]].x;
          return t > i ? t : i;
        } }, { key: "getMinX", value: function(o) {
          var t = this.pts[this.startIndex[o]].x, i = this.pts[this.startIndex[o + 1]].x;
          return t < i ? t : i;
        } }, { key: "computeIntersectsForChain", value: function() {
          if (arguments.length === 4) {
            var o = arguments[0], t = arguments[1], i = arguments[2], a = arguments[3];
            this.computeIntersectsForChain(this.startIndex[o], this.startIndex[o + 1], t, t.startIndex[i], t.startIndex[i + 1], a);
          } else if (arguments.length === 6) {
            var l = arguments[0], g = arguments[1], p = arguments[2], v = arguments[3], w = arguments[4], b = arguments[5];
            if (g - l == 1 && w - v == 1) return b.addIntersections(this.e, l, p.e, v), null;
            if (!this.overlaps(l, g, p, v, w)) return null;
            var z = Math.trunc((l + g) / 2), W = Math.trunc((v + w) / 2);
            l < z && (v < W && this.computeIntersectsForChain(l, z, p, v, W, b), W < w && this.computeIntersectsForChain(l, z, p, W, w, b)), z < g && (v < W && this.computeIntersectsForChain(z, g, p, v, W, b), W < w && this.computeIntersectsForChain(z, g, p, W, w, b));
          }
        } }, { key: "overlaps", value: function(o, t, i, a, l) {
          return be.intersects(this.pts[o], this.pts[t], i.pts[a], i.pts[l]);
        } }, { key: "getStartIndexes", value: function() {
          return this.startIndex;
        } }, { key: "computeIntersects", value: function(o, t) {
          for (var i = 0; i < this.startIndex.length - 1; i++) for (var a = 0; a < o.startIndex.length - 1; a++) this.computeIntersectsForChain(i, o, a, t);
        } }], [{ key: "constructor_", value: function() {
          this.e = null, this.pts = null, this.startIndex = null;
          var o = arguments[0];
          this.e = o, this.pts = o.getCoordinates();
          var t = new vp();
          this.startIndex = t.getChainStartIndices(this.pts);
        } }]);
      }(), zl = function() {
        function o() {
          u(this, o), o.constructor_.apply(this, arguments);
        }
        return h(o, [{ key: "getDepth", value: function(t, i) {
          return this._depth[t][i];
        } }, { key: "setDepth", value: function(t, i, a) {
          this._depth[t][i] = a;
        } }, { key: "isNull", value: function() {
          if (arguments.length === 0) {
            for (var t = 0; t < 2; t++) for (var i = 0; i < 3; i++) if (this._depth[t][i] !== o.NULL_VALUE) return !1;
            return !0;
          }
          if (arguments.length === 1) {
            var a = arguments[0];
            return this._depth[a][1] === o.NULL_VALUE;
          }
          if (arguments.length === 2) {
            var l = arguments[0], g = arguments[1];
            return this._depth[l][g] === o.NULL_VALUE;
          }
        } }, { key: "normalize", value: function() {
          for (var t = 0; t < 2; t++) if (!this.isNull(t)) {
            var i = this._depth[t][1];
            this._depth[t][2] < i && (i = this._depth[t][2]), i < 0 && (i = 0);
            for (var a = 1; a < 3; a++) {
              var l = 0;
              this._depth[t][a] > i && (l = 1), this._depth[t][a] = l;
            }
          }
        } }, { key: "getDelta", value: function(t) {
          return this._depth[t][ne.RIGHT] - this._depth[t][ne.LEFT];
        } }, { key: "getLocation", value: function(t, i) {
          return this._depth[t][i] <= 0 ? C.EXTERIOR : C.INTERIOR;
        } }, { key: "toString", value: function() {
          return "A: " + this._depth[0][1] + "," + this._depth[0][2] + " B: " + this._depth[1][1] + "," + this._depth[1][2];
        } }, { key: "add", value: function() {
          if (arguments.length === 1) for (var t = arguments[0], i = 0; i < 2; i++) for (var a = 1; a < 3; a++) {
            var l = t.getLocation(i, a);
            l !== C.EXTERIOR && l !== C.INTERIOR || (this.isNull(i, a) ? this._depth[i][a] = o.depthAtLocation(l) : this._depth[i][a] += o.depthAtLocation(l));
          }
          else if (arguments.length === 3) {
            var g = arguments[0], p = arguments[1];
            arguments[2] === C.INTERIOR && this._depth[g][p]++;
          }
        } }], [{ key: "constructor_", value: function() {
          this._depth = Array(2).fill().map(function() {
            return Array(3);
          });
          for (var t = 0; t < 2; t++) for (var i = 0; i < 3; i++) this._depth[t][i] = o.NULL_VALUE;
        } }, { key: "depthAtLocation", value: function(t) {
          return t === C.EXTERIOR ? 0 : t === C.INTERIOR ? 1 : o.NULL_VALUE;
        } }]);
      }();
      zl.NULL_VALUE = -1;
      var ql = function(o) {
        function t() {
          var i;
          return u(this, t), i = s(this, t), t.constructor_.apply(i, arguments), i;
        }
        return _(t, o), h(t, [{ key: "getDepth", value: function() {
          return this._depth;
        } }, { key: "getCollapsedEdge", value: function() {
          var i = new Array(2).fill(null);
          return i[0] = this.pts[0], i[1] = this.pts[1], new t(i, Ut.toLineLabel(this._label));
        } }, { key: "isIsolated", value: function() {
          return this._isIsolated;
        } }, { key: "getCoordinates", value: function() {
          return this.pts;
        } }, { key: "setIsolated", value: function(i) {
          this._isIsolated = i;
        } }, { key: "setName", value: function(i) {
          this._name = i;
        } }, { key: "equals", value: function(i) {
          if (!(i instanceof t)) return !1;
          var a = i;
          if (this.pts.length !== a.pts.length) return !1;
          for (var l = !0, g = !0, p = this.pts.length, v = 0; v < this.pts.length; v++) if (this.pts[v].equals2D(a.pts[v]) || (l = !1), this.pts[v].equals2D(a.pts[--p]) || (g = !1), !l && !g) return !1;
          return !0;
        } }, { key: "getCoordinate", value: function() {
          if (arguments.length === 0) return this.pts.length > 0 ? this.pts[0] : null;
          if (arguments.length === 1) {
            var i = arguments[0];
            return this.pts[i];
          }
        } }, { key: "print", value: function(i) {
          i.print("edge " + this._name + ": "), i.print("LINESTRING (");
          for (var a = 0; a < this.pts.length; a++) a > 0 && i.print(","), i.print(this.pts[a].x + " " + this.pts[a].y);
          i.print(")  " + this._label + " " + this._depthDelta);
        } }, { key: "computeIM", value: function(i) {
          t.updateIM(this._label, i);
        } }, { key: "isCollapsed", value: function() {
          return !!this._label.isArea() && this.pts.length === 3 && !!this.pts[0].equals(this.pts[2]);
        } }, { key: "isClosed", value: function() {
          return this.pts[0].equals(this.pts[this.pts.length - 1]);
        } }, { key: "getMaximumSegmentIndex", value: function() {
          return this.pts.length - 1;
        } }, { key: "getDepthDelta", value: function() {
          return this._depthDelta;
        } }, { key: "getNumPoints", value: function() {
          return this.pts.length;
        } }, { key: "printReverse", value: function(i) {
          i.print("edge " + this._name + ": ");
          for (var a = this.pts.length - 1; a >= 0; a--) i.print(this.pts[a] + " ");
          i.println("");
        } }, { key: "getMonotoneChainEdge", value: function() {
          return this._mce === null && (this._mce = new yp(this)), this._mce;
        } }, { key: "getEnvelope", value: function() {
          if (this._env === null) {
            this._env = new be();
            for (var i = 0; i < this.pts.length; i++) this._env.expandToInclude(this.pts[i]);
          }
          return this._env;
        } }, { key: "addIntersection", value: function(i, a, l, g) {
          var p = new J(i.getIntersection(g)), v = a, w = i.getEdgeDistance(l, g), b = v + 1;
          if (b < this.pts.length) {
            var z = this.pts[b];
            p.equals2D(z) && (v = b, w = 0);
          }
          this.eiList.add(p, v, w);
        } }, { key: "toString", value: function() {
          var i = new We();
          i.append("edge " + this._name + ": "), i.append("LINESTRING (");
          for (var a = 0; a < this.pts.length; a++) a > 0 && i.append(","), i.append(this.pts[a].x + " " + this.pts[a].y);
          return i.append(")  " + this._label + " " + this._depthDelta), i.toString();
        } }, { key: "isPointwiseEqual", value: function(i) {
          if (this.pts.length !== i.pts.length) return !1;
          for (var a = 0; a < this.pts.length; a++) if (!this.pts[a].equals2D(i.pts[a])) return !1;
          return !0;
        } }, { key: "setDepthDelta", value: function(i) {
          this._depthDelta = i;
        } }, { key: "getEdgeIntersectionList", value: function() {
          return this.eiList;
        } }, { key: "addIntersections", value: function(i, a, l) {
          for (var g = 0; g < i.getIntersectionNum(); g++) this.addIntersection(i, a, l, g);
        } }], [{ key: "constructor_", value: function() {
          if (this.pts = null, this._env = null, this.eiList = new dp(this), this._name = null, this._mce = null, this._isIsolated = !0, this._depth = new zl(), this._depthDelta = 0, arguments.length === 1) {
            var i = arguments[0];
            t.constructor_.call(this, i, null);
          } else if (arguments.length === 2) {
            var a = arguments[0], l = arguments[1];
            this.pts = a, this._label = l;
          }
        } }, { key: "updateIM", value: function() {
          if (!(arguments.length === 2 && arguments[1] instanceof pp && arguments[0] instanceof Ut)) return I(t, "updateIM", this).apply(this, arguments);
          var i = arguments[0], a = arguments[1];
          a.setAtLeastIfValid(i.getLocation(0, ne.ON), i.getLocation(1, ne.ON), 1), i.isArea() && (a.setAtLeastIfValid(i.getLocation(0, ne.LEFT), i.getLocation(1, ne.LEFT), 2), a.setAtLeastIfValid(i.getLocation(0, ne.RIGHT), i.getLocation(1, ne.RIGHT), 2));
        } }]);
      }(wl), Yl = function() {
        function o() {
          u(this, o), o.constructor_.apply(this, arguments);
        }
        return h(o, [{ key: "setWorkingPrecisionModel", value: function(t) {
          this._workingPrecisionModel = t;
        } }, { key: "insertUniqueEdge", value: function(t) {
          var i = this._edgeList.findEqualEdge(t);
          if (i !== null) {
            var a = i.getLabel(), l = t.getLabel();
            i.isPointwiseEqual(t) || (l = new Ut(t.getLabel())).flip(), a.merge(l);
            var g = o.depthDelta(l), p = i.getDepthDelta() + g;
            i.setDepthDelta(p);
          } else this._edgeList.add(t), t.setDepthDelta(o.depthDelta(t.getLabel()));
        } }, { key: "buildSubgraphs", value: function(t, i) {
          for (var a = new me(), l = t.iterator(); l.hasNext(); ) {
            var g = l.next(), p = g.getRightmostCoordinate(), v = new Dl(a).getDepth(p);
            g.computeDepth(v), g.findResultEdges(), a.add(g), i.add(g.getDirectedEdges(), g.getNodes());
          }
        } }, { key: "createSubgraphs", value: function(t) {
          for (var i = new me(), a = t.getNodes().iterator(); a.hasNext(); ) {
            var l = a.next();
            if (!l.isVisited()) {
              var g = new Ci();
              g.create(l), i.add(g);
            }
          }
          return Jr.sort(i, Jr.reverseOrder()), i;
        } }, { key: "createEmptyResultGeometry", value: function() {
          return this._geomFact.createPolygon();
        } }, { key: "getNoder", value: function(t) {
          if (this._workingNoder !== null) return this._workingNoder;
          var i = new co(), a = new yr();
          return a.setPrecisionModel(t), i.setSegmentIntersector(new fp(a)), i;
        } }, { key: "buffer", value: function(t, i) {
          var a = this._workingPrecisionModel;
          a === null && (a = t.getPrecisionModel()), this._geomFact = t.getFactory();
          var l = new np(a, this._bufParams), g = new ip(t, i, l).getCurves();
          if (g.size() <= 0) return this.createEmptyResultGeometry();
          this.computeNodedEdges(g, a), this._graph = new Tl(new cp()), this._graph.addEdges(this._edgeList.getEdges());
          var p = this.createSubgraphs(this._graph), v = new Yd(this._geomFact);
          this.buildSubgraphs(p, v);
          var w = v.getPolygons();
          return w.size() <= 0 ? this.createEmptyResultGeometry() : this._geomFact.buildGeometry(w);
        } }, { key: "computeNodedEdges", value: function(t, i) {
          var a = this.getNoder(i);
          a.computeNodes(t);
          for (var l = a.getNodedSubstrings().iterator(); l.hasNext(); ) {
            var g = l.next(), p = g.getCoordinates();
            if (p.length !== 2 || !p[0].equals2D(p[1])) {
              var v = g.getData(), w = new ql(g.getCoordinates(), new Ut(v));
              this.insertUniqueEdge(w);
            }
          }
        } }, { key: "setNoder", value: function(t) {
          this._workingNoder = t;
        } }], [{ key: "constructor_", value: function() {
          this._bufParams = null, this._workingPrecisionModel = null, this._workingNoder = null, this._geomFact = null, this._graph = null, this._edgeList = new hp();
          var t = arguments[0];
          this._bufParams = t;
        } }, { key: "depthDelta", value: function(t) {
          var i = t.getLocation(0, ne.LEFT), a = t.getLocation(0, ne.RIGHT);
          return i === C.INTERIOR && a === C.EXTERIOR ? 1 : i === C.EXTERIOR && a === C.INTERIOR ? -1 : 0;
        } }, { key: "convertSegStrings", value: function(t) {
          for (var i = new Yr(), a = new me(); t.hasNext(); ) {
            var l = t.next(), g = i.createLineString(l.getCoordinates());
            a.add(g);
          }
          return i.buildGeometry(a);
        } }]);
      }(), _p = function() {
        function o() {
          u(this, o), o.constructor_.apply(this, arguments);
        }
        return h(o, [{ key: "rescale", value: function() {
          if (Ee(arguments[0], Pe)) for (var t = arguments[0].iterator(); t.hasNext(); ) {
            var i = t.next();
            this.rescale(i.getCoordinates());
          }
          else if (arguments[0] instanceof Array) {
            for (var a = arguments[0], l = 0; l < a.length; l++) a[l].x = a[l].x / this._scaleFactor + this._offsetX, a[l].y = a[l].y / this._scaleFactor + this._offsetY;
            a.length === 2 && a[0].equals2D(a[1]) && at.out.println(a);
          }
        } }, { key: "scale", value: function() {
          if (Ee(arguments[0], Pe)) {
            for (var t = arguments[0], i = new me(t.size()), a = t.iterator(); a.hasNext(); ) {
              var l = a.next();
              i.add(new _r(this.scale(l.getCoordinates()), l.getData()));
            }
            return i;
          }
          if (arguments[0] instanceof Array) {
            for (var g = arguments[0], p = new Array(g.length).fill(null), v = 0; v < g.length; v++) p[v] = new J(Math.round((g[v].x - this._offsetX) * this._scaleFactor), Math.round((g[v].y - this._offsetY) * this._scaleFactor), g[v].getZ());
            return oe.removeRepeatedPoints(p);
          }
        } }, { key: "isIntegerPrecision", value: function() {
          return this._scaleFactor === 1;
        } }, { key: "getNodedSubstrings", value: function() {
          var t = this._noder.getNodedSubstrings();
          return this._isScaled && this.rescale(t), t;
        } }, { key: "computeNodes", value: function(t) {
          var i = t;
          this._isScaled && (i = this.scale(t)), this._noder.computeNodes(i);
        } }, { key: "interfaces_", get: function() {
          return [lo];
        } }], [{ key: "constructor_", value: function() {
          if (this._noder = null, this._scaleFactor = null, this._offsetX = null, this._offsetY = null, this._isScaled = !1, arguments.length === 2) {
            var t = arguments[0], i = arguments[1];
            o.constructor_.call(this, t, i, 0, 0);
          } else if (arguments.length === 4) {
            var a = arguments[0], l = arguments[1];
            this._noder = a, this._scaleFactor = l, this._isScaled = !this.isIntegerPrecision();
          }
        } }]);
      }(), Hl = function() {
        function o() {
          u(this, o), o.constructor_.apply(this, arguments);
        }
        return h(o, [{ key: "checkEndPtVertexIntersections", value: function() {
          if (arguments.length === 0) for (var t = this._segStrings.iterator(); t.hasNext(); ) {
            var i = t.next().getCoordinates();
            this.checkEndPtVertexIntersections(i[0], this._segStrings), this.checkEndPtVertexIntersections(i[i.length - 1], this._segStrings);
          }
          else if (arguments.length === 2) {
            for (var a = arguments[0], l = arguments[1].iterator(); l.hasNext(); ) for (var g = l.next().getCoordinates(), p = 1; p < g.length - 1; p++) if (g[p].equals(a)) throw new de("found endpt/interior pt intersection at index " + p + " :pt " + a);
          }
        } }, { key: "checkInteriorIntersections", value: function() {
          if (arguments.length === 0) for (var t = this._segStrings.iterator(); t.hasNext(); ) for (var i = t.next(), a = this._segStrings.iterator(); a.hasNext(); ) {
            var l = a.next();
            this.checkInteriorIntersections(i, l);
          }
          else if (arguments.length === 2) for (var g = arguments[0], p = arguments[1], v = g.getCoordinates(), w = p.getCoordinates(), b = 0; b < v.length - 1; b++) for (var z = 0; z < w.length - 1; z++) this.checkInteriorIntersections(g, b, p, z);
          else if (arguments.length === 4) {
            var W = arguments[0], Q = arguments[1], le = arguments[2], fe = arguments[3];
            if (W === le && Q === fe) return null;
            var ve = W.getCoordinates()[Q], Te = W.getCoordinates()[Q + 1], Ie = le.getCoordinates()[fe], Fe = le.getCoordinates()[fe + 1];
            if (this._li.computeIntersection(ve, Te, Ie, Fe), this._li.hasIntersection() && (this._li.isProper() || this.hasInteriorIntersection(this._li, ve, Te) || this.hasInteriorIntersection(this._li, Ie, Fe))) throw new de("found non-noded intersection at " + ve + "-" + Te + " and " + Ie + "-" + Fe);
          }
        } }, { key: "checkValid", value: function() {
          this.checkEndPtVertexIntersections(), this.checkInteriorIntersections(), this.checkCollapses();
        } }, { key: "checkCollapses", value: function() {
          if (arguments.length === 0) for (var t = this._segStrings.iterator(); t.hasNext(); ) {
            var i = t.next();
            this.checkCollapses(i);
          }
          else if (arguments.length === 1) for (var a = arguments[0].getCoordinates(), l = 0; l < a.length - 2; l++) this.checkCollapse(a[l], a[l + 1], a[l + 2]);
        } }, { key: "hasInteriorIntersection", value: function(t, i, a) {
          for (var l = 0; l < t.getIntersectionNum(); l++) {
            var g = t.getIntersection(l);
            if (!g.equals(i) && !g.equals(a)) return !0;
          }
          return !1;
        } }, { key: "checkCollapse", value: function(t, i, a) {
          if (t.equals(a)) throw new de("found non-noded collapse at " + o.fact.createLineString([t, i, a]));
        } }], [{ key: "constructor_", value: function() {
          this._li = new yr(), this._segStrings = null;
          var t = arguments[0];
          this._segStrings = t;
        } }]);
      }();
      Hl.fact = new Yr();
      var fo = function() {
        function o() {
          u(this, o), o.constructor_.apply(this, arguments);
        }
        return h(o, [{ key: "intersectsScaled", value: function(t, i) {
          var a = Math.min(t.x, i.x), l = Math.max(t.x, i.x), g = Math.min(t.y, i.y), p = Math.max(t.y, i.y), v = this._maxx < a || this._minx > l || this._maxy < g || this._miny > p;
          if (v) return !1;
          var w = this.intersectsToleranceSquare(t, i);
          return se.isTrue(!(v && w), "Found bad envelope test"), w;
        } }, { key: "initCorners", value: function(t) {
          var i = 0.5;
          this._minx = t.x - i, this._maxx = t.x + i, this._miny = t.y - i, this._maxy = t.y + i, this._corner[0] = new J(this._maxx, this._maxy), this._corner[1] = new J(this._minx, this._maxy), this._corner[2] = new J(this._minx, this._miny), this._corner[3] = new J(this._maxx, this._miny);
        } }, { key: "intersects", value: function(t, i) {
          return this._scaleFactor === 1 ? this.intersectsScaled(t, i) : (this.copyScaled(t, this._p0Scaled), this.copyScaled(i, this._p1Scaled), this.intersectsScaled(this._p0Scaled, this._p1Scaled));
        } }, { key: "scale", value: function(t) {
          return Math.round(t * this._scaleFactor);
        } }, { key: "getCoordinate", value: function() {
          return this._originalPt;
        } }, { key: "copyScaled", value: function(t, i) {
          i.x = this.scale(t.x), i.y = this.scale(t.y);
        } }, { key: "getSafeEnvelope", value: function() {
          if (this._safeEnv === null) {
            var t = o.SAFE_ENV_EXPANSION_FACTOR / this._scaleFactor;
            this._safeEnv = new be(this._originalPt.x - t, this._originalPt.x + t, this._originalPt.y - t, this._originalPt.y + t);
          }
          return this._safeEnv;
        } }, { key: "intersectsPixelClosure", value: function(t, i) {
          return this._li.computeIntersection(t, i, this._corner[0], this._corner[1]), !!this._li.hasIntersection() || (this._li.computeIntersection(t, i, this._corner[1], this._corner[2]), !!this._li.hasIntersection() || (this._li.computeIntersection(t, i, this._corner[2], this._corner[3]), !!this._li.hasIntersection() || (this._li.computeIntersection(t, i, this._corner[3], this._corner[0]), !!this._li.hasIntersection())));
        } }, { key: "intersectsToleranceSquare", value: function(t, i) {
          var a = !1, l = !1;
          return this._li.computeIntersection(t, i, this._corner[0], this._corner[1]), !!this._li.isProper() || (this._li.computeIntersection(t, i, this._corner[1], this._corner[2]), !!this._li.isProper() || (this._li.hasIntersection() && (a = !0), this._li.computeIntersection(t, i, this._corner[2], this._corner[3]), !!this._li.isProper() || (this._li.hasIntersection() && (l = !0), this._li.computeIntersection(t, i, this._corner[3], this._corner[0]), !!this._li.isProper() || !(!a || !l) || !!t.equals(this._pt) || !!i.equals(this._pt))));
        } }, { key: "addSnappedNode", value: function(t, i) {
          var a = t.getCoordinate(i), l = t.getCoordinate(i + 1);
          return !!this.intersects(a, l) && (t.addIntersection(this.getCoordinate(), i), !0);
        } }], [{ key: "constructor_", value: function() {
          this._li = null, this._pt = null, this._originalPt = null, this._ptScaled = null, this._p0Scaled = null, this._p1Scaled = null, this._scaleFactor = null, this._minx = null, this._maxx = null, this._miny = null, this._maxy = null, this._corner = new Array(4).fill(null), this._safeEnv = null;
          var t = arguments[0], i = arguments[1], a = arguments[2];
          if (this._originalPt = t, this._pt = t, this._scaleFactor = i, this._li = a, i <= 0) throw new X("Scale factor must be non-zero");
          i !== 1 && (this._pt = new J(this.scale(t.x), this.scale(t.y)), this._p0Scaled = new J(), this._p1Scaled = new J()), this.initCorners(this._pt);
        } }]);
      }();
      fo.SAFE_ENV_EXPANSION_FACTOR = 0.75;
      var Ep = function() {
        return h(function o() {
          u(this, o), o.constructor_.apply(this, arguments);
        }, [{ key: "select", value: function() {
          if (arguments.length !== 1) {
            if (arguments.length === 2) {
              var o = arguments[1];
              arguments[0].getLineSegment(o, this.selectedSegment), this.select(this.selectedSegment);
            }
          }
        } }], [{ key: "constructor_", value: function() {
          this.selectedSegment = new Lt();
        } }]);
      }(), Jl = function() {
        return h(function o() {
          u(this, o), o.constructor_.apply(this, arguments);
        }, [{ key: "snap", value: function() {
          if (arguments.length === 1) {
            var o = arguments[0];
            return this.snap(o, null, -1);
          }
          if (arguments.length === 3) {
            var t = arguments[0], i = arguments[1], a = arguments[2], l = t.getSafeEnvelope(), g = new Vl(t, i, a);
            return this._index.query(l, new (function() {
              return h(function p() {
                u(this, p);
              }, [{ key: "interfaces_", get: function() {
                return [Cl];
              } }, { key: "visitItem", value: function(p) {
                p.select(l, g);
              } }]);
            }())()), g.isNodeAdded();
          }
        } }], [{ key: "constructor_", value: function() {
          this._index = null;
          var o = arguments[0];
          this._index = o;
        } }]);
      }(), Vl = function(o) {
        function t() {
          var i;
          return u(this, t), i = s(this, t), t.constructor_.apply(i, arguments), i;
        }
        return _(t, o), h(t, [{ key: "isNodeAdded", value: function() {
          return this._isNodeAdded;
        } }, { key: "select", value: function() {
          if (!(arguments.length === 2 && Number.isInteger(arguments[1]) && arguments[0] instanceof Nl)) return I(t, "select", this, 1).apply(this, arguments);
          var i = arguments[1], a = arguments[0].getContext();
          if (this._parentEdge === a && (i === this._hotPixelVertexIndex || i + 1 === this._hotPixelVertexIndex)) return null;
          this._isNodeAdded |= this._hotPixel.addSnappedNode(a, i);
        } }], [{ key: "constructor_", value: function() {
          this._hotPixel = null, this._parentEdge = null, this._hotPixelVertexIndex = null, this._isNodeAdded = !1;
          var i = arguments[0], a = arguments[1], l = arguments[2];
          this._hotPixel = i, this._parentEdge = a, this._hotPixelVertexIndex = l;
        } }]);
      }(Ep);
      Jl.HotPixelSnapAction = Vl;
      var xp = function() {
        return h(function o() {
          u(this, o), o.constructor_.apply(this, arguments);
        }, [{ key: "processIntersections", value: function(o, t, i, a) {
          if (o === i && t === a) return null;
          var l = o.getCoordinates()[t], g = o.getCoordinates()[t + 1], p = i.getCoordinates()[a], v = i.getCoordinates()[a + 1];
          if (this._li.computeIntersection(l, g, p, v), this._li.hasIntersection() && this._li.isInteriorIntersection()) {
            for (var w = 0; w < this._li.getIntersectionNum(); w++) this._interiorIntersections.add(this._li.getIntersection(w));
            o.addIntersections(this._li, t, 0), i.addIntersections(this._li, a, 1);
          }
        } }, { key: "isDone", value: function() {
          return !1;
        } }, { key: "getInteriorIntersections", value: function() {
          return this._interiorIntersections;
        } }, { key: "interfaces_", get: function() {
          return [Ul];
        } }], [{ key: "constructor_", value: function() {
          this._li = null, this._interiorIntersections = null;
          var o = arguments[0];
          this._li = o, this._interiorIntersections = new me();
        } }]);
      }(), wp = function() {
        return h(function o() {
          u(this, o), o.constructor_.apply(this, arguments);
        }, [{ key: "checkCorrectness", value: function(o) {
          var t = _r.getNodedSubstrings(o), i = new Hl(t);
          try {
            i.checkValid();
          } catch (a) {
            if (!(a instanceof V)) throw a;
            a.printStackTrace();
          }
        } }, { key: "getNodedSubstrings", value: function() {
          return _r.getNodedSubstrings(this._nodedSegStrings);
        } }, { key: "snapRound", value: function(o, t) {
          var i = this.findInteriorIntersections(o, t);
          this.computeIntersectionSnaps(i), this.computeVertexSnaps(o);
        } }, { key: "findInteriorIntersections", value: function(o, t) {
          var i = new xp(t);
          return this._noder.setSegmentIntersector(i), this._noder.computeNodes(o), i.getInteriorIntersections();
        } }, { key: "computeVertexSnaps", value: function() {
          if (Ee(arguments[0], Pe)) for (var o = arguments[0].iterator(); o.hasNext(); ) {
            var t = o.next();
            this.computeVertexSnaps(t);
          }
          else if (arguments[0] instanceof _r) for (var i = arguments[0], a = i.getCoordinates(), l = 0; l < a.length; l++) {
            var g = new fo(a[l], this._scaleFactor, this._li);
            this._pointSnapper.snap(g, i, l) && i.addIntersection(a[l], l);
          }
        } }, { key: "computeNodes", value: function(o) {
          this._nodedSegStrings = o, this._noder = new co(), this._pointSnapper = new Jl(this._noder.getIndex()), this.snapRound(o, this._li);
        } }, { key: "computeIntersectionSnaps", value: function(o) {
          for (var t = o.iterator(); t.hasNext(); ) {
            var i = t.next(), a = new fo(i, this._scaleFactor, this._li);
            this._pointSnapper.snap(a);
          }
        } }, { key: "interfaces_", get: function() {
          return [lo];
        } }], [{ key: "constructor_", value: function() {
          this._pm = null, this._li = null, this._scaleFactor = null, this._noder = null, this._pointSnapper = null, this._nodedSegStrings = null;
          var o = arguments[0];
          this._pm = o, this._li = new yr(), this._li.setPrecisionModel(o), this._scaleFactor = o.getScale();
        } }]);
      }(), Wr = function() {
        function o() {
          u(this, o), o.constructor_.apply(this, arguments);
        }
        return h(o, [{ key: "bufferFixedPrecision", value: function(t) {
          var i = new _p(new wp(new St(1)), t.getScale()), a = new Yl(this._bufParams);
          a.setWorkingPrecisionModel(t), a.setNoder(i), this._resultGeometry = a.buffer(this._argGeom, this._distance);
        } }, { key: "bufferReducedPrecision", value: function() {
          if (arguments.length === 0) {
            for (var t = o.MAX_PRECISION_DIGITS; t >= 0; t--) {
              try {
                this.bufferReducedPrecision(t);
              } catch (g) {
                if (!(g instanceof xt)) throw g;
                this._saveException = g;
              }
              if (this._resultGeometry !== null) return null;
            }
            throw this._saveException;
          }
          if (arguments.length === 1) {
            var i = arguments[0], a = o.precisionScaleFactor(this._argGeom, this._distance, i), l = new St(a);
            this.bufferFixedPrecision(l);
          }
        } }, { key: "computeGeometry", value: function() {
          if (this.bufferOriginalPrecision(), this._resultGeometry !== null) return null;
          var t = this._argGeom.getFactory().getPrecisionModel();
          t.getType() === St.FIXED ? this.bufferFixedPrecision(t) : this.bufferReducedPrecision();
        } }, { key: "setQuadrantSegments", value: function(t) {
          this._bufParams.setQuadrantSegments(t);
        } }, { key: "bufferOriginalPrecision", value: function() {
          try {
            var t = new Yl(this._bufParams);
            this._resultGeometry = t.buffer(this._argGeom, this._distance);
          } catch (i) {
            if (!(i instanceof de)) throw i;
            this._saveException = i;
          }
        } }, { key: "getResultGeometry", value: function(t) {
          return this._distance = t, this.computeGeometry(), this._resultGeometry;
        } }, { key: "setEndCapStyle", value: function(t) {
          this._bufParams.setEndCapStyle(t);
        } }], [{ key: "constructor_", value: function() {
          if (this._argGeom = null, this._distance = null, this._bufParams = new H(), this._resultGeometry = null, this._saveException = null, arguments.length === 1) {
            var t = arguments[0];
            this._argGeom = t;
          } else if (arguments.length === 2) {
            var i = arguments[0], a = arguments[1];
            this._argGeom = i, this._bufParams = a;
          }
        } }, { key: "bufferOp", value: function() {
          if (arguments.length === 2) {
            var t = arguments[1];
            return new o(arguments[0]).getResultGeometry(t);
          }
          if (arguments.length === 3) {
            if (Number.isInteger(arguments[2]) && arguments[0] instanceof he && typeof arguments[1] == "number") {
              var i = arguments[1], a = arguments[2], l = new o(arguments[0]);
              return l.setQuadrantSegments(a), l.getResultGeometry(i);
            }
            if (arguments[2] instanceof H && arguments[0] instanceof he && typeof arguments[1] == "number") {
              var g = arguments[1];
              return new o(arguments[0], arguments[2]).getResultGeometry(g);
            }
          } else if (arguments.length === 4) {
            var p = arguments[1], v = arguments[2], w = arguments[3], b = new o(arguments[0]);
            return b.setQuadrantSegments(v), b.setEndCapStyle(w), b.getResultGeometry(p);
          }
        } }, { key: "precisionScaleFactor", value: function(t, i, a) {
          var l = t.getEnvelopeInternal(), g = mn.max(Math.abs(l.getMaxX()), Math.abs(l.getMaxY()), Math.abs(l.getMinX()), Math.abs(l.getMinY())) + 2 * (i > 0 ? i : 0), p = a - Math.trunc(Math.log(g) / Math.log(10) + 1);
          return Math.pow(10, p);
        } }]);
      }();
      Wr.CAP_ROUND = H.CAP_ROUND, Wr.CAP_BUTT = H.CAP_FLAT, Wr.CAP_FLAT = H.CAP_FLAT, Wr.CAP_SQUARE = H.CAP_SQUARE, Wr.MAX_PRECISION_DIGITS = 12;
      var kp = ["Point", "MultiPoint", "LineString", "MultiLineString", "Polygon", "MultiPolygon"], Xl = function() {
        return h(function o(t) {
          u(this, o), this.geometryFactory = t || new Yr();
        }, [{ key: "read", value: function(o) {
          var t, i = (t = typeof o == "string" ? JSON.parse(o) : o).type;
          if (!qt[i]) throw new Error("Unknown GeoJSON type: " + t.type);
          return kp.indexOf(i) !== -1 ? qt[i].call(this, t.coordinates) : i === "GeometryCollection" ? qt[i].call(this, t.geometries) : qt[i].call(this, t);
        } }, { key: "write", value: function(o) {
          var t = o.getGeometryType();
          if (!En[t]) throw new Error("Geometry is not supported");
          return En[t].call(this, o);
        } }]);
      }(), qt = { Feature: function(o) {
        var t = {};
        for (var i in o) t[i] = o[i];
        if (o.geometry) {
          var a = o.geometry.type;
          if (!qt[a]) throw new Error("Unknown GeoJSON type: " + o.type);
          t.geometry = this.read(o.geometry);
        }
        return o.bbox && (t.bbox = qt.bbox.call(this, o.bbox)), t;
      }, FeatureCollection: function(o) {
        var t = {};
        if (o.features) {
          t.features = [];
          for (var i = 0; i < o.features.length; ++i) t.features.push(this.read(o.features[i]));
        }
        return o.bbox && (t.bbox = this.parse.bbox.call(this, o.bbox)), t;
      }, coordinates: function(o) {
        for (var t = [], i = 0; i < o.length; ++i) {
          var a = o[i];
          t.push(c(J, D(a)));
        }
        return t;
      }, bbox: function(o) {
        return this.geometryFactory.createLinearRing([new J(o[0], o[1]), new J(o[2], o[1]), new J(o[2], o[3]), new J(o[0], o[3]), new J(o[0], o[1])]);
      }, Point: function(o) {
        var t = c(J, D(o));
        return this.geometryFactory.createPoint(t);
      }, MultiPoint: function(o) {
        for (var t = [], i = 0; i < o.length; ++i) t.push(qt.Point.call(this, o[i]));
        return this.geometryFactory.createMultiPoint(t);
      }, LineString: function(o) {
        var t = qt.coordinates.call(this, o);
        return this.geometryFactory.createLineString(t);
      }, MultiLineString: function(o) {
        for (var t = [], i = 0; i < o.length; ++i) t.push(qt.LineString.call(this, o[i]));
        return this.geometryFactory.createMultiLineString(t);
      }, Polygon: function(o) {
        for (var t = qt.coordinates.call(this, o[0]), i = this.geometryFactory.createLinearRing(t), a = [], l = 1; l < o.length; ++l) {
          var g = o[l], p = qt.coordinates.call(this, g), v = this.geometryFactory.createLinearRing(p);
          a.push(v);
        }
        return this.geometryFactory.createPolygon(i, a);
      }, MultiPolygon: function(o) {
        for (var t = [], i = 0; i < o.length; ++i) {
          var a = o[i];
          t.push(qt.Polygon.call(this, a));
        }
        return this.geometryFactory.createMultiPolygon(t);
      }, GeometryCollection: function(o) {
        for (var t = [], i = 0; i < o.length; ++i) {
          var a = o[i];
          t.push(this.read(a));
        }
        return this.geometryFactory.createGeometryCollection(t);
      } }, En = { coordinate: function(o) {
        var t = [o.x, o.y];
        return o.z && t.push(o.z), o.m && t.push(o.m), t;
      }, Point: function(o) {
        return { type: "Point", coordinates: En.coordinate.call(this, o.getCoordinate()) };
      }, MultiPoint: function(o) {
        for (var t = [], i = 0; i < o._geometries.length; ++i) {
          var a = o._geometries[i], l = En.Point.call(this, a);
          t.push(l.coordinates);
        }
        return { type: "MultiPoint", coordinates: t };
      }, LineString: function(o) {
        for (var t = [], i = o.getCoordinates(), a = 0; a < i.length; ++a) {
          var l = i[a];
          t.push(En.coordinate.call(this, l));
        }
        return { type: "LineString", coordinates: t };
      }, MultiLineString: function(o) {
        for (var t = [], i = 0; i < o._geometries.length; ++i) {
          var a = o._geometries[i], l = En.LineString.call(this, a);
          t.push(l.coordinates);
        }
        return { type: "MultiLineString", coordinates: t };
      }, Polygon: function(o) {
        var t = [], i = En.LineString.call(this, o._shell);
        t.push(i.coordinates);
        for (var a = 0; a < o._holes.length; ++a) {
          var l = o._holes[a], g = En.LineString.call(this, l);
          t.push(g.coordinates);
        }
        return { type: "Polygon", coordinates: t };
      }, MultiPolygon: function(o) {
        for (var t = [], i = 0; i < o._geometries.length; ++i) {
          var a = o._geometries[i], l = En.Polygon.call(this, a);
          t.push(l.coordinates);
        }
        return { type: "MultiPolygon", coordinates: t };
      }, GeometryCollection: function(o) {
        for (var t = [], i = 0; i < o._geometries.length; ++i) {
          var a = o._geometries[i], l = a.getGeometryType();
          t.push(En[l].call(this, a));
        }
        return { type: "GeometryCollection", geometries: t };
      } };
      return { BufferOp: Wr, GeoJSONReader: function() {
        return h(function o(t) {
          u(this, o), this.parser = new Xl(t || new Yr());
        }, [{ key: "read", value: function(o) {
          return this.parser.read(o);
        } }]);
      }(), GeoJSONWriter: function() {
        return h(function o() {
          u(this, o), this.parser = new Xl(this.geometryFactory);
        }, [{ key: "write", value: function(o) {
          return this.parser.write(o);
        } }]);
      }() };
    });
  }(ea)), ea.exports;
}
var wE = xE();
const kE = /* @__PURE__ */ cf(wE);
function dr() {
  return new pa();
}
function pa() {
  this.reset();
}
pa.prototype = {
  constructor: pa,
  reset: function() {
    this.s = // rounded value
    this.t = 0;
  },
  add: function(n) {
    Xc(Fs, n, this.t), Xc(this, Fs.s, this.s), this.s ? this.t += Fs.t : this.s = Fs.t;
  },
  valueOf: function() {
    return this.s;
  }
};
var Fs = new pa();
function Xc(n, r, e) {
  var s = n.s = r + e, u = s - r, c = s - u;
  n.t = r - c + (e - u);
}
var He = 1e-6, Ce = Math.PI, Sn = Ce / 2, Wc = Ce / 4, Cn = Ce * 2, nr = 180 / Ce, Xt = Ce / 180, it = Math.abs, SE = Math.atan, fi = Math.atan2, Ve = Math.cos, Xe = Math.sin, yi = Math.sqrt;
function cg(n) {
  return n > 1 ? 0 : n < -1 ? Ce : Math.acos(n);
}
function Ar(n) {
  return n > 1 ? Sn : n < -1 ? -Sn : Math.asin(n);
}
function $i() {
}
function ma(n, r) {
  n && jc.hasOwnProperty(n.type) && jc[n.type](n, r);
}
var Zc = {
  Feature: function(n, r) {
    ma(n.geometry, r);
  },
  FeatureCollection: function(n, r) {
    for (var e = n.features, s = -1, u = e.length; ++s < u; ) ma(e[s].geometry, r);
  }
}, jc = {
  Sphere: function(n, r) {
    r.sphere();
  },
  Point: function(n, r) {
    n = n.coordinates, r.point(n[0], n[1], n[2]);
  },
  MultiPoint: function(n, r) {
    for (var e = n.coordinates, s = -1, u = e.length; ++s < u; ) n = e[s], r.point(n[0], n[1], n[2]);
  },
  LineString: function(n, r) {
    tu(n.coordinates, r, 0);
  },
  MultiLineString: function(n, r) {
    for (var e = n.coordinates, s = -1, u = e.length; ++s < u; ) tu(e[s], r, 0);
  },
  Polygon: function(n, r) {
    $c(n.coordinates, r);
  },
  MultiPolygon: function(n, r) {
    for (var e = n.coordinates, s = -1, u = e.length; ++s < u; ) $c(e[s], r);
  },
  GeometryCollection: function(n, r) {
    for (var e = n.geometries, s = -1, u = e.length; ++s < u; ) ma(e[s], r);
  }
};
function tu(n, r, e) {
  var s = -1, u = n.length - e, c;
  for (r.lineStart(); ++s < u; ) c = n[s], r.point(c[0], c[1], c[2]);
  r.lineEnd();
}
function $c(n, r) {
  var e = -1, s = n.length;
  for (r.polygonStart(); ++e < s; ) tu(n[e], r, 1);
  r.polygonEnd();
}
function ME(n, r) {
  n && Zc.hasOwnProperty(n.type) ? Zc[n.type](n, r) : ma(n, r);
}
dr();
dr();
function nu(n) {
  return [fi(n[1], n[0]), Ar(n[2])];
}
function gi(n) {
  var r = n[0], e = n[1], s = Ve(e);
  return [s * Ve(r), s * Xe(r), Xe(e)];
}
function Gs(n, r) {
  return n[0] * r[0] + n[1] * r[1] + n[2] * r[2];
}
function va(n, r) {
  return [n[1] * r[2] - n[2] * r[1], n[2] * r[0] - n[0] * r[2], n[0] * r[1] - n[1] * r[0]];
}
function wo(n, r) {
  n[0] += r[0], n[1] += r[1], n[2] += r[2];
}
function Bs(n, r) {
  return [n[0] * r, n[1] * r, n[2] * r];
}
function ru(n) {
  var r = yi(n[0] * n[0] + n[1] * n[1] + n[2] * n[2]);
  n[0] /= r, n[1] /= r, n[2] /= r;
}
dr();
function hg(n, r) {
  function e(s, u) {
    return s = n(s, u), r(s[0], s[1]);
  }
  return n.invert && r.invert && (e.invert = function(s, u) {
    return s = r.invert(s, u), s && n.invert(s[0], s[1]);
  }), e;
}
function iu(n, r) {
  return [n > Ce ? n - Cn : n < -Ce ? n + Cn : n, r];
}
iu.invert = iu;
function IE(n, r, e) {
  return (n %= Cn) ? r || e ? hg(Qc(n), eh(r, e)) : Qc(n) : r || e ? eh(r, e) : iu;
}
function Kc(n) {
  return function(r, e) {
    return r += n, [r > Ce ? r - Cn : r < -Ce ? r + Cn : r, e];
  };
}
function Qc(n) {
  var r = Kc(n);
  return r.invert = Kc(-n), r;
}
function eh(n, r) {
  var e = Ve(n), s = Xe(n), u = Ve(r), c = Xe(r);
  function f(h, m) {
    var d = Ve(m), y = Ve(h) * d, _ = Xe(h) * d, E = Xe(m), S = E * e + y * s;
    return [
      fi(_ * u - S * c, y * e - E * s),
      Ar(S * u + _ * c)
    ];
  }
  return f.invert = function(h, m) {
    var d = Ve(m), y = Ve(h) * d, _ = Xe(h) * d, E = Xe(m), S = E * u - _ * c;
    return [
      fi(_ * u + E * c, y * e + S * s),
      Ar(S * e - y * s)
    ];
  }, f;
}
function bE(n, r, e, s, u, c) {
  if (e) {
    var f = Ve(r), h = Xe(r), m = s * e;
    u == null ? (u = r + s * Cn, c = r - m / 2) : (u = th(f, u), c = th(f, c), (s > 0 ? u < c : u > c) && (u += s * Cn));
    for (var d, y = u; s > 0 ? y > c : y < c; y -= m)
      d = nu([f, -h * Ve(y), -h * Xe(y)]), n.point(d[0], d[1]);
  }
}
function th(n, r) {
  r = gi(r), r[0] -= n, ru(r);
  var e = cg(-r[1]);
  return ((-r[2] < 0 ? -e : e) + Cn - He) % Cn;
}
function fg() {
  var n = [], r;
  return {
    point: function(e, s) {
      r.push([e, s]);
    },
    lineStart: function() {
      n.push(r = []);
    },
    lineEnd: $i,
    rejoin: function() {
      n.length > 1 && n.push(n.pop().concat(n.shift()));
    },
    result: function() {
      var e = n;
      return n = [], r = null, e;
    }
  };
}
function TE(n, r, e, s, u, c) {
  var f = n[0], h = n[1], m = r[0], d = r[1], y = 0, _ = 1, E = m - f, S = d - h, I;
  if (I = e - f, !(!E && I > 0)) {
    if (I /= E, E < 0) {
      if (I < y) return;
      I < _ && (_ = I);
    } else if (E > 0) {
      if (I > _) return;
      I > y && (y = I);
    }
    if (I = u - f, !(!E && I < 0)) {
      if (I /= E, E < 0) {
        if (I > _) return;
        I > y && (y = I);
      } else if (E > 0) {
        if (I < y) return;
        I < _ && (_ = I);
      }
      if (I = s - h, !(!S && I > 0)) {
        if (I /= S, S < 0) {
          if (I < y) return;
          I < _ && (_ = I);
        } else if (S > 0) {
          if (I > _) return;
          I > y && (y = I);
        }
        if (I = c - h, !(!S && I < 0)) {
          if (I /= S, S < 0) {
            if (I > _) return;
            I > y && (y = I);
          } else if (S > 0) {
            if (I < y) return;
            I < _ && (_ = I);
          }
          return y > 0 && (n[0] = f + y * E, n[1] = h + y * S), _ < 1 && (r[0] = f + _ * E, r[1] = h + _ * S), !0;
        }
      }
    }
  }
}
function ta(n, r) {
  return it(n[0] - r[0]) < He && it(n[1] - r[1]) < He;
}
function Us(n, r, e, s) {
  this.x = n, this.z = r, this.o = e, this.e = s, this.v = !1, this.n = this.p = null;
}
function gg(n, r, e, s, u) {
  var c = [], f = [], h, m;
  if (n.forEach(function(I) {
    if (!((D = I.length - 1) <= 0)) {
      var D, q = I[0], G = I[D], M;
      if (ta(q, G)) {
        for (u.lineStart(), h = 0; h < D; ++h) u.point((q = I[h])[0], q[1]);
        u.lineEnd();
        return;
      }
      c.push(M = new Us(q, I, null, !0)), f.push(M.o = new Us(q, null, M, !1)), c.push(M = new Us(G, I, null, !1)), f.push(M.o = new Us(G, null, M, !0));
    }
  }), !!c.length) {
    for (f.sort(r), nh(c), nh(f), h = 0, m = f.length; h < m; ++h)
      f[h].e = e = !e;
    for (var d = c[0], y, _; ; ) {
      for (var E = d, S = !0; E.v; ) if ((E = E.n) === d) return;
      y = E.z, u.lineStart();
      do {
        if (E.v = E.o.v = !0, E.e) {
          if (S)
            for (h = 0, m = y.length; h < m; ++h) u.point((_ = y[h])[0], _[1]);
          else
            s(E.x, E.n.x, 1, u);
          E = E.n;
        } else {
          if (S)
            for (y = E.p.z, h = y.length - 1; h >= 0; --h) u.point((_ = y[h])[0], _[1]);
          else
            s(E.x, E.p.x, -1, u);
          E = E.p;
        }
        E = E.o, y = E.z, S = !S;
      } while (!E.v);
      u.lineEnd();
    }
  }
}
function nh(n) {
  if (r = n.length) {
    for (var r, e = 0, s = n[0], u; ++e < r; )
      s.n = u = n[e], u.p = s, s = u;
    s.n = u = n[0], u.p = s;
  }
}
function dg(n, r) {
  return n < r ? -1 : n > r ? 1 : n >= r ? 0 : NaN;
}
function LE(n) {
  return n.length === 1 && (n = CE(n)), {
    left: function(r, e, s, u) {
      for (s == null && (s = 0), u == null && (u = r.length); s < u; ) {
        var c = s + u >>> 1;
        n(r[c], e) < 0 ? s = c + 1 : u = c;
      }
      return s;
    },
    right: function(r, e, s, u) {
      for (s == null && (s = 0), u == null && (u = r.length); s < u; ) {
        var c = s + u >>> 1;
        n(r[c], e) > 0 ? u = c : s = c + 1;
      }
      return s;
    }
  };
}
function CE(n) {
  return function(r, e) {
    return dg(n(r), e);
  };
}
LE(dg);
function pg(n) {
  for (var r = n.length, e, s = -1, u = 0, c, f; ++s < r; ) u += n[s].length;
  for (c = new Array(u); --r >= 0; )
    for (f = n[r], e = f.length; --e >= 0; )
      c[--u] = f[e];
  return c;
}
var zs = 1e9, qs = -1e9;
function AE(n, r, e, s) {
  function u(d, y) {
    return n <= d && d <= e && r <= y && y <= s;
  }
  function c(d, y, _, E) {
    var S = 0, I = 0;
    if (d == null || (S = f(d, _)) !== (I = f(y, _)) || m(d, y) < 0 ^ _ > 0)
      do
        E.point(S === 0 || S === 3 ? n : e, S > 1 ? s : r);
      while ((S = (S + _ + 4) % 4) !== I);
    else
      E.point(y[0], y[1]);
  }
  function f(d, y) {
    return it(d[0] - n) < He ? y > 0 ? 0 : 3 : it(d[0] - e) < He ? y > 0 ? 2 : 1 : it(d[1] - r) < He ? y > 0 ? 1 : 0 : y > 0 ? 3 : 2;
  }
  function h(d, y) {
    return m(d.x, y.x);
  }
  function m(d, y) {
    var _ = f(d, 1), E = f(y, 1);
    return _ !== E ? _ - E : _ === 0 ? y[1] - d[1] : _ === 1 ? d[0] - y[0] : _ === 2 ? d[1] - y[1] : y[0] - d[0];
  }
  return function(d) {
    var y = d, _ = fg(), E, S, I, D, q, G, M, H, V, X, j, $ = {
      point: x,
      lineStart: A,
      lineEnd: F,
      polygonStart: T,
      polygonEnd: L
    };
    function x(N, P) {
      u(N, P) && y.point(N, P);
    }
    function k() {
      for (var N = 0, P = 0, Y = S.length; P < Y; ++P)
        for (var U = S[P], Z = 1, K = U.length, re = U[0], de, ce, se = re[0], ue = re[1]; Z < K; ++Z)
          de = se, ce = ue, re = U[Z], se = re[0], ue = re[1], ce <= s ? ue > s && (se - de) * (s - ce) > (ue - ce) * (n - de) && ++N : ue <= s && (se - de) * (s - ce) < (ue - ce) * (n - de) && --N;
      return N;
    }
    function T() {
      y = _, E = [], S = [], j = !0;
    }
    function L() {
      var N = k(), P = j && N, Y = (E = pg(E)).length;
      (P || Y) && (d.polygonStart(), P && (d.lineStart(), c(null, null, 1, d), d.lineEnd()), Y && gg(E, h, N, c, d), d.polygonEnd()), y = d, E = S = I = null;
    }
    function A() {
      $.point = O, S && S.push(I = []), X = !0, V = !1, M = H = NaN;
    }
    function F() {
      E && (O(D, q), G && V && _.rejoin(), E.push(_.result())), $.point = x, V && y.lineEnd();
    }
    function O(N, P) {
      var Y = u(N, P);
      if (S && I.push([N, P]), X)
        D = N, q = P, G = Y, X = !1, Y && (y.lineStart(), y.point(N, P));
      else if (Y && V) y.point(N, P);
      else {
        var U = [M = Math.max(qs, Math.min(zs, M)), H = Math.max(qs, Math.min(zs, H))], Z = [N = Math.max(qs, Math.min(zs, N)), P = Math.max(qs, Math.min(zs, P))];
        TE(U, Z, n, r, e, s) ? (V || (y.lineStart(), y.point(U[0], U[1])), y.point(Z[0], Z[1]), Y || y.lineEnd(), j = !1) : Y && (y.lineStart(), y.point(N, P), j = !1);
      }
      M = N, H = P, V = Y;
    }
    return $;
  };
}
var ko = dr();
function NE(n, r) {
  var e = r[0], s = r[1], u = [Xe(e), -Ve(e), 0], c = 0, f = 0;
  ko.reset();
  for (var h = 0, m = n.length; h < m; ++h)
    if (y = (d = n[h]).length)
      for (var d, y, _ = d[y - 1], E = _[0], S = _[1] / 2 + Wc, I = Xe(S), D = Ve(S), q = 0; q < y; ++q, E = M, I = V, D = X, _ = G) {
        var G = d[q], M = G[0], H = G[1] / 2 + Wc, V = Xe(H), X = Ve(H), j = M - E, $ = j >= 0 ? 1 : -1, x = $ * j, k = x > Ce, T = I * V;
        if (ko.add(fi(T * $ * Xe(x), D * X + T * Ve(x))), c += k ? j + $ * Cn : j, k ^ E >= e ^ M >= e) {
          var L = va(gi(_), gi(G));
          ru(L);
          var A = va(u, L);
          ru(A);
          var F = (k ^ j >= 0 ? -1 : 1) * Ar(A[2]);
          (s > F || s === F && (L[0] || L[1])) && (f += k ^ j >= 0 ? 1 : -1);
        }
      }
  return (c < -1e-6 || c < He && ko < -1e-6) ^ f & 1;
}
dr();
function rh(n) {
  return n;
}
dr();
dr();
var di = 1 / 0, ya = di, ds = -di, _a = ds, ih = {
  point: OE,
  lineStart: $i,
  lineEnd: $i,
  polygonStart: $i,
  polygonEnd: $i,
  result: function() {
    var n = [[di, ya], [ds, _a]];
    return ds = _a = -(ya = di = 1 / 0), n;
  }
};
function OE(n, r) {
  n < di && (di = n), n > ds && (ds = n), r < ya && (ya = r), r > _a && (_a = r);
}
dr();
function mg(n, r, e, s) {
  return function(u, c) {
    var f = r(c), h = u.invert(s[0], s[1]), m = fg(), d = r(m), y = !1, _, E, S, I = {
      point: D,
      lineStart: G,
      lineEnd: M,
      polygonStart: function() {
        I.point = H, I.lineStart = V, I.lineEnd = X, E = [], _ = [];
      },
      polygonEnd: function() {
        I.point = D, I.lineStart = G, I.lineEnd = M, E = pg(E);
        var j = NE(_, h);
        E.length ? (y || (c.polygonStart(), y = !0), gg(E, RE, j, e, c)) : j && (y || (c.polygonStart(), y = !0), c.lineStart(), e(null, null, 1, c), c.lineEnd()), y && (c.polygonEnd(), y = !1), E = _ = null;
      },
      sphere: function() {
        c.polygonStart(), c.lineStart(), e(null, null, 1, c), c.lineEnd(), c.polygonEnd();
      }
    };
    function D(j, $) {
      var x = u(j, $);
      n(j = x[0], $ = x[1]) && c.point(j, $);
    }
    function q(j, $) {
      var x = u(j, $);
      f.point(x[0], x[1]);
    }
    function G() {
      I.point = q, f.lineStart();
    }
    function M() {
      I.point = D, f.lineEnd();
    }
    function H(j, $) {
      S.push([j, $]);
      var x = u(j, $);
      d.point(x[0], x[1]);
    }
    function V() {
      d.lineStart(), S = [];
    }
    function X() {
      H(S[0][0], S[0][1]), d.lineEnd();
      var j = d.clean(), $ = m.result(), x, k = $.length, T, L, A;
      if (S.pop(), _.push(S), S = null, !!k) {
        if (j & 1) {
          if (L = $[0], (T = L.length - 1) > 0) {
            for (y || (c.polygonStart(), y = !0), c.lineStart(), x = 0; x < T; ++x) c.point((A = L[x])[0], A[1]);
            c.lineEnd();
          }
          return;
        }
        k > 1 && j & 2 && $.push($.pop().concat($.shift())), E.push($.filter(PE));
      }
    }
    return I;
  };
}
function PE(n) {
  return n.length > 1;
}
function RE(n, r) {
  return ((n = n.x)[0] < 0 ? n[1] - Sn - He : Sn - n[1]) - ((r = r.x)[0] < 0 ? r[1] - Sn - He : Sn - r[1]);
}
const sh = mg(
  function() {
    return !0;
  },
  DE,
  GE,
  [-Ce, -Sn]
);
function DE(n) {
  var r = NaN, e = NaN, s = NaN, u;
  return {
    lineStart: function() {
      n.lineStart(), u = 1;
    },
    point: function(c, f) {
      var h = c > 0 ? Ce : -Ce, m = it(c - r);
      it(m - Ce) < He ? (n.point(r, e = (e + f) / 2 > 0 ? Sn : -Sn), n.point(s, e), n.lineEnd(), n.lineStart(), n.point(h, e), n.point(c, e), u = 0) : s !== h && m >= Ce && (it(r - s) < He && (r -= s * He), it(c - h) < He && (c -= h * He), e = FE(r, e, c, f), n.point(s, e), n.lineEnd(), n.lineStart(), n.point(h, e), u = 0), n.point(r = c, e = f), s = h;
    },
    lineEnd: function() {
      n.lineEnd(), r = e = NaN;
    },
    clean: function() {
      return 2 - u;
    }
  };
}
function FE(n, r, e, s) {
  var u, c, f = Xe(n - e);
  return it(f) > He ? SE((Xe(r) * (c = Ve(s)) * Xe(e) - Xe(s) * (u = Ve(r)) * Xe(n)) / (u * c * f)) : (r + s) / 2;
}
function GE(n, r, e, s) {
  var u;
  if (n == null)
    u = e * Sn, s.point(-Ce, u), s.point(0, u), s.point(Ce, u), s.point(Ce, 0), s.point(Ce, -u), s.point(0, -u), s.point(-Ce, -u), s.point(-Ce, 0), s.point(-Ce, u);
  else if (it(n[0] - r[0]) > He) {
    var c = n[0] < r[0] ? Ce : -Ce;
    u = e * c / 2, s.point(-c, u), s.point(0, u), s.point(c, u);
  } else
    s.point(r[0], r[1]);
}
function BE(n, r) {
  var e = Ve(n), s = e > 0, u = it(e) > He;
  function c(y, _, E, S) {
    bE(S, n, r, E, y, _);
  }
  function f(y, _) {
    return Ve(y) * Ve(_) > e;
  }
  function h(y) {
    var _, E, S, I, D;
    return {
      lineStart: function() {
        I = S = !1, D = 1;
      },
      point: function(q, G) {
        var M = [q, G], H, V = f(q, G), X = s ? V ? 0 : d(q, G) : V ? d(q + (q < 0 ? Ce : -Ce), G) : 0;
        if (!_ && (I = S = V) && y.lineStart(), V !== S && (H = m(_, M), (!H || ta(_, H) || ta(M, H)) && (M[0] += He, M[1] += He, V = f(M[0], M[1]))), V !== S)
          D = 0, V ? (y.lineStart(), H = m(M, _), y.point(H[0], H[1])) : (H = m(_, M), y.point(H[0], H[1]), y.lineEnd()), _ = H;
        else if (u && _ && s ^ V) {
          var j;
          !(X & E) && (j = m(M, _, !0)) && (D = 0, s ? (y.lineStart(), y.point(j[0][0], j[0][1]), y.point(j[1][0], j[1][1]), y.lineEnd()) : (y.point(j[1][0], j[1][1]), y.lineEnd(), y.lineStart(), y.point(j[0][0], j[0][1])));
        }
        V && (!_ || !ta(_, M)) && y.point(M[0], M[1]), _ = M, S = V, E = X;
      },
      lineEnd: function() {
        S && y.lineEnd(), _ = null;
      },
      // Rejoin first and last segments if there were intersections and the first
      // and last points were visible.
      clean: function() {
        return D | (I && S) << 1;
      }
    };
  }
  function m(y, _, E) {
    var S = gi(y), I = gi(_), D = [1, 0, 0], q = va(S, I), G = Gs(q, q), M = q[0], H = G - M * M;
    if (!H) return !E && y;
    var V = e * G / H, X = -e * M / H, j = va(D, q), $ = Bs(D, V), x = Bs(q, X);
    wo($, x);
    var k = j, T = Gs($, k), L = Gs(k, k), A = T * T - L * (Gs($, $) - 1);
    if (!(A < 0)) {
      var F = yi(A), O = Bs(k, (-T - F) / L);
      if (wo(O, $), O = nu(O), !E) return O;
      var N = y[0], P = _[0], Y = y[1], U = _[1], Z;
      P < N && (Z = N, N = P, P = Z);
      var K = P - N, re = it(K - Ce) < He, de = re || K < He;
      if (!re && U < Y && (Z = Y, Y = U, U = Z), de ? re ? Y + U > 0 ^ O[1] < (it(O[0] - N) < He ? Y : U) : Y <= O[1] && O[1] <= U : K > Ce ^ (N <= O[0] && O[0] <= P)) {
        var ce = Bs(k, (-T + F) / L);
        return wo(ce, $), [O, nu(ce)];
      }
    }
  }
  function d(y, _) {
    var E = s ? n : Ce - n, S = 0;
    return y < -E ? S |= 1 : y > E && (S |= 2), _ < -E ? S |= 4 : _ > E && (S |= 8), S;
  }
  return mg(f, h, c, s ? [0, -n] : [-Ce, n - Ce]);
}
function vg(n) {
  return function(r) {
    var e = new su();
    for (var s in n) e[s] = n[s];
    return e.stream = r, e;
  };
}
function su() {
}
su.prototype = {
  constructor: su,
  point: function(n, r) {
    this.stream.point(n, r);
  },
  sphere: function() {
    this.stream.sphere();
  },
  lineStart: function() {
    this.stream.lineStart();
  },
  lineEnd: function() {
    this.stream.lineEnd();
  },
  polygonStart: function() {
    this.stream.polygonStart();
  },
  polygonEnd: function() {
    this.stream.polygonEnd();
  }
};
function yg(n, r, e) {
  var s = r[1][0] - r[0][0], u = r[1][1] - r[0][1], c = n.clipExtent && n.clipExtent();
  n.scale(150).translate([0, 0]), c != null && n.clipExtent(null), ME(e, n.stream(ih));
  var f = ih.result(), h = Math.min(s / (f[1][0] - f[0][0]), u / (f[1][1] - f[0][1])), m = +r[0][0] + (s - h * (f[1][0] + f[0][0])) / 2, d = +r[0][1] + (u - h * (f[1][1] + f[0][1])) / 2;
  return c != null && n.clipExtent(c), n.scale(h * 150).translate([m, d]);
}
function UE(n, r, e) {
  return yg(n, [[0, 0], r], e);
}
var ah = 16, zE = Ve(30 * Xt);
function oh(n, r) {
  return +r ? YE(n, r) : qE(n);
}
function qE(n) {
  return vg({
    point: function(r, e) {
      r = n(r, e), this.stream.point(r[0], r[1]);
    }
  });
}
function YE(n, r) {
  function e(s, u, c, f, h, m, d, y, _, E, S, I, D, q) {
    var G = d - s, M = y - u, H = G * G + M * M;
    if (H > 4 * r && D--) {
      var V = f + E, X = h + S, j = m + I, $ = yi(V * V + X * X + j * j), x = Ar(j /= $), k = it(it(j) - 1) < He || it(c - _) < He ? (c + _) / 2 : fi(X, V), T = n(k, x), L = T[0], A = T[1], F = L - s, O = A - u, N = M * F - G * O;
      (N * N / H > r || it((G * F + M * O) / H - 0.5) > 0.3 || f * E + h * S + m * I < zE) && (e(s, u, c, f, h, m, L, A, k, V /= $, X /= $, j, D, q), q.point(L, A), e(L, A, k, V, X, j, d, y, _, E, S, I, D, q));
    }
  }
  return function(s) {
    var u, c, f, h, m, d, y, _, E, S, I, D, q = {
      point: G,
      lineStart: M,
      lineEnd: V,
      polygonStart: function() {
        s.polygonStart(), q.lineStart = X;
      },
      polygonEnd: function() {
        s.polygonEnd(), q.lineStart = M;
      }
    };
    function G(x, k) {
      x = n(x, k), s.point(x[0], x[1]);
    }
    function M() {
      _ = NaN, q.point = H, s.lineStart();
    }
    function H(x, k) {
      var T = gi([x, k]), L = n(x, k);
      e(_, E, y, S, I, D, _ = L[0], E = L[1], y = x, S = T[0], I = T[1], D = T[2], ah, s), s.point(_, E);
    }
    function V() {
      q.point = G, s.lineEnd();
    }
    function X() {
      M(), q.point = j, q.lineEnd = $;
    }
    function j(x, k) {
      H(u = x, k), c = _, f = E, h = S, m = I, d = D, q.point = H;
    }
    function $() {
      e(_, E, y, S, I, D, c, f, u, h, m, d, ah, s), q.lineEnd = V, V();
    }
    return q;
  };
}
var HE = vg({
  point: function(n, r) {
    this.stream.point(n * Xt, r * Xt);
  }
});
function JE(n) {
  return VE(function() {
    return n;
  })();
}
function VE(n) {
  var r, e = 150, s = 480, u = 250, c, f, h = 0, m = 0, d = 0, y = 0, _ = 0, E, S, I = null, D = sh, q = null, G, M, H, V = rh, X = 0.5, j = oh(L, X), $, x;
  function k(O) {
    return O = S(O[0] * Xt, O[1] * Xt), [O[0] * e + c, f - O[1] * e];
  }
  function T(O) {
    return O = S.invert((O[0] - c) / e, (f - O[1]) / e), O && [O[0] * nr, O[1] * nr];
  }
  function L(O, N) {
    return O = r(O, N), [O[0] * e + c, f - O[1] * e];
  }
  k.stream = function(O) {
    return $ && x === O ? $ : $ = HE(D(E, j(V(x = O))));
  }, k.clipAngle = function(O) {
    return arguments.length ? (D = +O ? BE(I = O * Xt, 6 * Xt) : (I = null, sh), F()) : I * nr;
  }, k.clipExtent = function(O) {
    return arguments.length ? (V = O == null ? (q = G = M = H = null, rh) : AE(q = +O[0][0], G = +O[0][1], M = +O[1][0], H = +O[1][1]), F()) : q == null ? null : [[q, G], [M, H]];
  }, k.scale = function(O) {
    return arguments.length ? (e = +O, A()) : e;
  }, k.translate = function(O) {
    return arguments.length ? (s = +O[0], u = +O[1], A()) : [s, u];
  }, k.center = function(O) {
    return arguments.length ? (h = O[0] % 360 * Xt, m = O[1] % 360 * Xt, A()) : [h * nr, m * nr];
  }, k.rotate = function(O) {
    return arguments.length ? (d = O[0] % 360 * Xt, y = O[1] % 360 * Xt, _ = O.length > 2 ? O[2] % 360 * Xt : 0, A()) : [d * nr, y * nr, _ * nr];
  }, k.precision = function(O) {
    return arguments.length ? (j = oh(L, X = O * O), F()) : yi(X);
  }, k.fitExtent = function(O, N) {
    return yg(k, O, N);
  }, k.fitSize = function(O, N) {
    return UE(k, O, N);
  };
  function A() {
    S = hg(E = IE(d, y, _), r);
    var O = r(h, m);
    return c = s - O[0] * e, f = u + O[1] * e, F();
  }
  function F() {
    return $ = x = null, k;
  }
  return function() {
    return r = n.apply(this, arguments), k.invert = r.invert && T, A();
  };
}
function _g(n) {
  return function(r, e) {
    var s = Ve(r), u = Ve(e), c = n(s * u);
    return [
      c * u * Xe(r),
      c * Xe(e)
    ];
  };
}
function Eg(n) {
  return function(r, e) {
    var s = yi(r * r + e * e), u = n(s), c = Xe(u), f = Ve(u);
    return [
      fi(r * c, s * f),
      Ar(s && e * c / s)
    ];
  };
}
var XE = _g(function(n) {
  return yi(2 / (1 + n));
});
XE.invert = Eg(function(n) {
  return 2 * Ar(n / 2);
});
var xg = _g(function(n) {
  return (n = cg(n)) && n / Xe(n);
});
xg.invert = Eg(function(n) {
  return n;
});
function WE() {
  return JE(xg).scale(79.4188).clipAngle(180 - 1e-3);
}
function uh(n, r) {
  return [n, r];
}
uh.invert = uh;
var { BufferOp: ZE, GeoJSONReader: jE, GeoJSONWriter: $E } = kE;
function KE(n, r, e) {
  e = e || {};
  var s = e.units || "kilometers", u = e.steps || 8;
  if (!n) throw new Error("geojson is required");
  if (typeof e != "object") throw new Error("options must be an object");
  if (typeof u != "number") throw new Error("steps must be an number");
  if (r === void 0) throw new Error("radius is required");
  if (u <= 0) throw new Error("steps must be greater than 0");
  var c = [];
  switch (n.type) {
    case "GeometryCollection":
      return gr(n, function(f) {
        var h = na(f, r, s, u);
        h && c.push(h);
      }), Ke(c);
    case "FeatureCollection":
      return Tn(n, function(f) {
        var h = na(f, r, s, u);
        h && Tn(h, function(m) {
          m && c.push(m);
        });
      }), Ke(c);
  }
  return na(n, r, s, u);
}
function na(n, r, e, s) {
  var u = n.properties || {}, c = n.type === "Feature" ? n.geometry : n;
  if (c.type === "GeometryCollection") {
    var f = [];
    return gr(n, function(D) {
      var q = na(D, r, e, s);
      q && f.push(q);
    }), Ke(f);
  }
  var h = QE(c), m = {
    type: c.type,
    coordinates: kg(c.coordinates, h)
  }, d = new jE(), y = d.read(m), _ = Iu(bu(r, e), "meters"), E = ZE.bufferOp(y, _, s), S = new $E();
  if (E = S.write(E), !wg(E.coordinates)) {
    var I = {
      type: E.type,
      coordinates: Sg(E.coordinates, h)
    };
    return cn(I, u);
  }
}
function wg(n) {
  return Array.isArray(n[0]) ? wg(n[0]) : isNaN(n[0]);
}
function kg(n, r) {
  return typeof n[0] != "object" ? r(n) : n.map(function(e) {
    return kg(e, r);
  });
}
function Sg(n, r) {
  return typeof n[0] != "object" ? r.invert(n) : n.map(function(e) {
    return Sg(e, r);
  });
}
function QE(n) {
  var r = _E(n).geometry.coordinates, e = [-r[0], -r[1]];
  return WE().rotate(e).scale(nt);
}
var ex = KE;
const tx = (n, r) => (xs(n, (e) => {
  const s = e.coordinate;
  s[0] += r.lng, s[1] += r.lat;
}), n), nx = (n, r) => {
  const s = n.getBounds(), u = df(s[0], s[1], { units: "meters" });
  return ex(r, u * 1e-4, { units: "meters" }) || null;
}, Mg = (n, r) => {
  const e = hn(n.getGeoJson());
  return tx(e, r), e;
}, jS = (n, r) => {
  const e = Mg(n, r);
  n.shapeProperties.center && (n.shapeProperties.center[0] += r.lng, n.shapeProperties.center[1] += r.lat), n.updateGeoJsonGeometry(e.geometry);
}, rx = (n, r) => {
  try {
    xs(n, (e) => {
      if (!Cr(e.coordinate, r))
        throw new Error("stop");
    });
  } catch {
    return !1;
  }
  return !0;
}, lh = (n, r) => {
  const e = rx(n, r);
  return lg(n) ? e : e && eu(n) ? !gE(
    n,
    r,
    { ignoreSelfIntersections: !0 }
  ).features.length : !1;
}, $u = (n) => {
  const r = n.getGeoJson();
  return typeof r != "object" ? null : $f(r);
}, ix = (n) => {
  if (eu(n)) {
    const r = mE(n, { mutate: !1 });
    if (r.type === "Feature" && eu(r))
      return {
        ...r,
        properties: n.properties || {}
      };
  }
  return lg(n) ? n : null;
}, Ig = [
  "click",
  "dblclick",
  "mousedown",
  "mouseup",
  "mousemove",
  "mouseenter",
  "mouseleave",
  "mouseover",
  "mouseout",
  "contextmenu",
  "touchstart",
  "touchend",
  "touchmove",
  "touchcancel"
], sx = [
  "load"
];
function $S(n) {
  return Ig.includes(n);
}
function KS(n) {
  return sx.includes(n);
}
const ax = (n) => !!(n && typeof n == "object" && "once" in n && typeof n.once == "function"), st = (n, r = { warning: !1 }) => {
  if (!n)
    return r.warning && ae.warn("Empty event", n), !1;
  const e = typeof n == "object" && "lngLat" in n && "point" in n && "type" in n && "originalEvent" in n && typeof n.type == "string" && Ig.includes(n.type);
  return !e && r.warning && ae.warn("Not a pointer event", n), e;
}, ee = {
  main: `${pe}_main`,
  temporary: `${pe}_temporary`,
  standby: `${pe}_standby`
}, br = "_gmid";
class ox {
  constructor(r) {
    R(this, "gm");
    R(this, "featureCounter", 0);
    R(this, "featureStore", /* @__PURE__ */ new Map());
    R(this, "featureStoreAllowedSources", [ee.main, ee.temporary]);
    R(this, "autoUpdatesEnabled", !0);
    R(this, "diffUpdatesEnabled", !0);
    R(this, "sources");
    R(this, "defaultSourceName", ee.main);
    R(this, "updateStorage");
    R(this, "delayedSourceUpdateMethods");
    R(this, "layers");
    this.gm = r, this.sources = Object.fromEntries(
      ji(ee).map((e) => [e, null])
    ), this.updateStorage = Object.fromEntries(
      ji(ee).map((e) => [
        e,
        { add: [], remove: [], update: [] }
      ])
    ), this.delayedSourceUpdateMethods = Object.fromEntries(
      ji(ee).map((e) => [
        e,
        {
          throttled: this.getDelayedSourceUpdateMethod({
            sourceName: e,
            type: "throttled"
          }),
          debounced: this.getDelayedSourceUpdateMethod({
            sourceName: e,
            type: "debounced"
          })
        }
      ])
    ), this.layers = [];
  }
  init() {
    if (Object.values(this.sources).some((r) => r !== null)) {
      ae.warn("features.init(): features are already initialized");
      return;
    }
    ft(this.sources).forEach((r) => {
      this.sources[r] = this.createSource(r);
    }), this.layers = this.createLayers();
  }
  get forEach() {
    return this.filteredForEach((r) => !r.temporary);
  }
  get tmpForEach() {
    return this.filteredForEach((r) => r.temporary);
  }
  getNewFeatureId() {
    return this.featureCounter += 1, `feature-${this.featureCounter}`;
  }
  filteredForEach(r) {
    return (e) => {
      this.featureStore.forEach((s, u, c) => {
        r(s) && e(s, u, c);
      });
    };
  }
  has(r, e) {
    const s = this.featureStore.get(e);
    return !!s && (s == null ? void 0 : s.source) === this.sources[r];
  }
  get(r, e) {
    const s = this.featureStore.get(e) || null;
    return (s == null ? void 0 : s.source) === this.sources[r] ? s : null;
  }
  add(r) {
    if (this.featureStore.has(r.id)) {
      ae.error(`features.add: feature with the id "${r.id}" already exists`);
      return;
    }
    this.featureStoreAllowedSources.includes(r.source.id) && this.featureStore.set(r.id, r);
  }
  setDefaultSourceName(r) {
    this.defaultSourceName = r;
  }
  getDelayedSourceUpdateMethod({ sourceName: r, type: e }) {
    if (e === "throttled")
      return Wf(
        () => this.updateSourceByStorage(r),
        2 * this.gm.options.settings.throttlingDelay,
        { leading: !1, trailing: !0 }
      );
    if (e === "debounced")
      return Uu(
        () => this.updateSourceByStorage(r),
        2 * this.gm.options.settings.throttlingDelay,
        { leading: !0, trailing: !1 }
      );
    throw new Error("Features: getDelayedSourceUpdateMethod: invalid type");
  }
  updateSourceByStorage(r) {
    const e = this.sources[r], s = this.updateStorage[r], u = Object.values(s).some((c) => c.length);
    e && u && (e.updateData(s), this.resetDiffStorage(r));
  }
  resetDiffStorage(r) {
    const e = this.updateStorage[r];
    e.add = [], e.remove = [], e.update = [];
  }
  withAtomicSourcesUpdate(r) {
    try {
      return this.autoUpdatesEnabled = !1, r();
    } finally {
      ji(ee).forEach((e) => {
        this.updateSourceByStorage(e);
      }), this.autoUpdatesEnabled = !0;
    }
  }
  updateSourceData({ diff: r, sourceName: e }) {
    this.gm.features.diffUpdatesEnabled ? this.updateSourceDataWithDiff({ diff: r, sourceName: e }) : this.setSourceData({ diff: r, sourceName: e });
  }
  updateSourceDataWithDiff({ diff: r, sourceName: e }) {
    const s = this.updateStorage[e];
    r.add && (s.add = s.add.concat(r.add)), r.update && (s.update = s.update.concat(r.update)), r.remove && (s.remove = s.remove.concat(r.remove)), this.gm.features.autoUpdatesEnabled && (this.delayedSourceUpdateMethods[e].throttled(), this.delayedSourceUpdateMethods[e].debounced());
  }
  setSourceData({ sourceName: r }) {
    ae.warn("Review this Features.setSourceData() method");
    const e = this.getSourceGeoJson(r);
    e.features = e.features.filter((s) => !!s), this.setSourceGeoJson({ geoJson: e, sourceName: r });
  }
  createSource(r) {
    const e = this.gm.mapAdapter.addSource(
      r,
      {
        type: "FeatureCollection",
        features: []
      }
    );
    if (e)
      return e;
    throw new Error(`Features: failed to create the source: "${r}"`);
  }
  delete(r) {
    let e;
    r instanceof da ? e = r : e = this.featureStore.get(r) || null, e ? (e.removeMarkers(), e.removeGeoJson(), this.featureStore.delete(e.id)) : ae.error(`features.delete: feature "${r}" not found`);
  }
  getFeatureByMouseEvent({ event: r, sourceNames: e }) {
    if (!st(r, { warning: !0 }))
      return null;
    const s = [r.point.x, r.point.y], u = this.gm.mapAdapter.queryFeaturesByScreenCoordinates({
      queryCoordinates: s,
      sourceNames: e
    });
    return u.length ? u[0] : null;
  }
  getFeaturesByGeoJsonBounds({ geoJson: r, sourceNames: e }) {
    const s = Ju(r), u = this.gm.mapAdapter.coordBoundsToScreenBounds(s);
    return this.getFeaturesByScreenBounds({ bounds: u, sourceNames: e });
  }
  getFeaturesByScreenBounds({ bounds: r, sourceNames: e }) {
    return this.gm.mapAdapter.queryFeaturesByScreenCoordinates({
      queryCoordinates: r,
      sourceNames: e
    });
  }
  createFeature({ featureId: r, shapeGeoJson: e, parent: s, sourceName: u, imported: c }) {
    const f = this.sources[u];
    if (!f)
      return ae.error("Features.createFeature Missing source for feature creation"), null;
    const h = r || e.properties[br] || this.getNewFeatureId();
    if (this.featureStore.get(h))
      return ae.error(
        `Features.createFeature: feature with the id "${h}" already exists`,
        this.featureStore.get(h)
      ), null;
    const m = new da({
      gm: this.gm,
      id: h,
      parent: s || null,
      source: f,
      geoJsonShapeFeature: hn(e)
    });
    return this.add(m), !m.temporary && !c && this.fireFeatureCreatedEvent(m), this.featureCounter += 1, m;
  }
  importGeoJson(r) {
    const e = "features" in r ? r.features : [r], s = {
      stats: {
        total: 0,
        success: 0,
        failed: 0
      },
      addedFeatures: []
    };
    return e.forEach((u) => {
      let c = null;
      s.stats.total += 1;
      const f = ix(u);
      f && (c = this.importGeoJsonFeature(f)), c ? (s.addedFeatures.push(c), s.stats.success += 1) : s.stats.failed += 1;
    }), s;
  }
  importGeoJsonFeature(r) {
    const e = this.defaultSourceName, s = this.getFeatureShapeByGeoJson(r);
    if (!s)
      return ae.error("features.addGeoJsonFeature: unknown shape", s), null;
    const u = r.id || `${e}-feature-${this.featureCounter}`;
    return this.createFeature({
      featureId: r.id,
      shapeGeoJson: {
        ...r,
        properties: {
          ...r.properties,
          [br]: u,
          shape: s
        }
      },
      sourceName: e,
      imported: !0
    });
  }
  getAll() {
    return this.exportGeoJson();
  }
  exportGeoJson({ allowedShapes: r } = { allowedShapes: void 0 }) {
    return this.asGeoJsonFeatureCollection({
      sourceNames: [ee.main, ee.standby],
      shapeTypes: r || [...as]
    });
  }
  getSourceGeoJson(r) {
    const e = this.sources[r];
    if (!e)
      throw new Error(`getSourceGeoJson: missing source "${r}"`);
    return e.getGeoJson();
  }
  setSourceGeoJson({ geoJson: r, sourceName: e }) {
    const s = this.sources[e];
    if (!s)
      throw new Error(`setSourceGeoJson: missing source "${e}"`);
    s.setGeoJson(r);
  }
  asGeoJsonFeatureCollection({ shapeTypes: r, sourceNames: e }) {
    const s = {
      type: "FeatureCollection",
      features: []
    };
    return e.forEach((u) => {
      const c = this.sources[u];
      c && c.getGeoJson().features.filter((h) => !!h).forEach((h) => {
        (r === void 0 || r.includes(h.properties.shape)) && s.features.push(h);
      });
    }), s;
  }
  convertSourceToGm(r) {
    const e = [], s = r.getGeoJson(), u = "features" in s ? s.features : [s];
    return this.gm.mapAdapter.getSource(r.id).remove({ removeLayers: !1 }), u.forEach((f) => {
      const h = this.addGeoJsonFeature({
        shapeGeoJson: f,
        defaultSource: !0
      });
      h && e.push(h);
    }), e;
  }
  addGeoJsonFeature({ shapeGeoJson: r, sourceName: e, defaultSource: s }) {
    let u;
    if (s ? (u = this.defaultSourceName, e && ae.warn("features.addGeoJsonFeature: default source is set, sourceName is ignored")) : u = e || null, !u)
      return ae.error("features.addGeoJsonFeature: missing sourceName"), null;
    const c = this.getFeatureShapeByGeoJson(r);
    return c ? this.createFeature({
      featureId: r.id,
      shapeGeoJson: {
        ...r,
        properties: { ...r.properties, shape: c }
      },
      sourceName: u
    }) : (ae.error("features.addGeoJsonFeature: unknown shape", c), null);
  }
  createLayers() {
    const r = [];
    return ft(this.gm.options.layerStyles).forEach((e) => {
      ft(this.gm.options.layerStyles[e]).forEach((s) => {
        this.gm.options.layerStyles[e][s].forEach((c) => {
          const f = this.createGenericLayer({
            layerId: `${s}-${e}-${c.type}-layer`,
            partialStyle: c,
            shape: e,
            sourceName: s
          });
          f && r.push(f);
        });
      });
    }), r;
  }
  createGenericLayer({ layerId: r, sourceName: e, partialStyle: s, shape: u }) {
    const c = {
      ...s,
      id: r,
      source: e,
      filter: [
        "in",
        ["get", "shape"],
        ["literal", [u]]
      ]
    };
    return this.gm.mapAdapter.addLayer(c);
  }
  getFeatureShapeByGeoJson(r) {
    const e = {
      Point: "marker",
      LineString: "line",
      Polygon: "polygon",
      MultiPolygon: "polygon"
    }, s = r.properties;
    return s != null && s.shape && as.includes(s == null ? void 0 : s.shape) ? s == null ? void 0 : s.shape : e[r.geometry.type] || null;
  }
  createMarkerFeature({ parentFeature: r, coordinate: e, type: s, sourceName: u }) {
    return this.createFeature({
      sourceName: u,
      parent: r,
      shapeGeoJson: {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: e
        },
        properties: {
          shape: `${s}_marker`
        }
      }
    });
  }
  updateMarkerFeaturePosition(r, e) {
    r.updateGeoJsonGeometry({
      type: "Point",
      coordinates: e
    });
  }
  fireFeatureCreatedEvent(r) {
    if (Ir(r.shape, as)) {
      const e = {
        level: "system",
        type: "draw",
        mode: r.shape,
        action: "feature_created",
        featureData: r
      };
      this.gm.events.fire(`${pe}:draw`, e);
    }
  }
}
const So = (n) => [
  {
    type: "circle",
    paint: {
      "circle-radius": n.circleMarkerRadius,
      "circle-color": n.fillColor,
      "circle-opacity": n.fillOpacity,
      "circle-stroke-color": n.lineColor,
      "circle-stroke-width": n.lineWidth,
      "circle-stroke-opacity": n.lineOpacity
    }
  }
], jr = (n) => [
  {
    type: "circle",
    paint: {
      "circle-radius": 7,
      "circle-color": "#ffffff",
      "circle-opacity": 1,
      "circle-stroke-color": n.lineColor,
      "circle-stroke-width": 2,
      "circle-stroke-opacity": 1
    }
  }
], Mo = (n) => [
  {
    type: "line",
    paint: {
      "line-color": n.lineColor,
      "line-opacity": n.lineOpacity,
      "line-width": n.lineWidth
    }
  }
], Io = () => [
  {
    type: "symbol",
    layout: {
      "icon-image": "default-marker",
      "icon-size": 0.18,
      "icon-allow-overlap": !0,
      "icon-anchor": "bottom"
    }
  }
], Fn = (n) => [
  {
    type: "fill",
    paint: {
      "fill-color": n.fillColor,
      "fill-opacity": n.fillOpacity
    }
  },
  {
    type: "line",
    paint: {
      "line-color": n.lineColor,
      "line-opacity": n.lineOpacity,
      "line-width": n.lineWidth
    }
  }
], bo = (n) => [
  {
    type: "circle",
    paint: {
      "circle-radius": 6,
      "circle-color": "#ffffff",
      "circle-opacity": 0.6,
      "circle-stroke-color": n.lineColor,
      "circle-stroke-width": 2,
      "circle-stroke-opacity": 1
    }
  }
], To = () => [
  {
    type: "line",
    paint: {
      "line-color": "#00979f",
      "line-width": 1.8,
      "line-dasharray": [2, 1]
    }
  }
], Lo = () => [
  {
    type: "symbol",
    layout: {
      "text-field": ["get", "text"],
      "text-justify": "center"
    },
    paint: {
      "text-color": "black",
      "text-halo-color": "#fff",
      "text-halo-width": 2
    }
  }
], Ye = {
  [ee.main]: {
    lineColor: "#278cda",
    lineOpacity: 0.8,
    lineWidth: 3,
    fillColor: "#4fb3ff",
    fillOpacity: 0.4,
    circleMarkerRadius: 10
  },
  [ee.temporary]: {
    lineColor: "#ff5600",
    lineOpacity: 0.8,
    lineWidth: 3,
    fillColor: "#4fb3ff",
    fillOpacity: 0.4,
    circleMarkerRadius: 10
  },
  [ee.standby]: {
    lineColor: "#787878",
    lineOpacity: 0.8,
    lineWidth: 3,
    fillColor: "#a5a5a5",
    fillOpacity: 0.4,
    circleMarkerRadius: 10
  }
}, ux = {
  line: {
    [ee.main]: Mo(Ye[ee.main]),
    [ee.temporary]: Mo(Ye[ee.temporary]),
    [ee.standby]: Mo(Ye[ee.standby])
  },
  circle: {
    [ee.main]: Fn(Ye[ee.main]),
    [ee.temporary]: Fn(Ye[ee.temporary]),
    [ee.standby]: Fn(Ye[ee.standby])
  },
  rectangle: {
    [ee.main]: Fn(Ye[ee.main]),
    [ee.temporary]: Fn(Ye[ee.temporary]),
    [ee.standby]: Fn(Ye[ee.standby])
  },
  polygon: {
    [ee.main]: Fn(Ye[ee.main]),
    [ee.temporary]: Fn(Ye[ee.temporary]),
    [ee.standby]: Fn(Ye[ee.standby])
  },
  marker: {
    [ee.temporary]: Io(),
    [ee.main]: Io(),
    [ee.standby]: Io()
  },
  circle_marker: {
    [ee.main]: So(Ye[ee.main]),
    [ee.temporary]: So(Ye[ee.temporary]),
    [ee.standby]: So(Ye[ee.standby])
  },
  text_marker: {
    [ee.main]: Lo(),
    [ee.temporary]: Lo(),
    [ee.standby]: Lo()
  },
  dom_marker: {
    // not a geojson source, layers aren't required
    [ee.main]: [],
    [ee.temporary]: [],
    [ee.standby]: []
  },
  center_marker: {
    [ee.main]: jr(Ye[ee.main]),
    [ee.temporary]: jr(Ye[ee.temporary]),
    [ee.standby]: jr(Ye[ee.standby])
  },
  vertex_marker: {
    [ee.main]: jr(Ye[ee.main]),
    [ee.temporary]: jr(Ye[ee.temporary]),
    [ee.standby]: jr(Ye[ee.standby])
  },
  edge_marker: {
    [ee.main]: bo(Ye[ee.main]),
    [ee.temporary]: bo(Ye[ee.temporary]),
    [ee.standby]: bo(Ye[ee.standby])
  },
  snap_guide: {
    // todo: check which sources can't display snap guides (and other shapes) and remove layers
    [ee.main]: To(),
    [ee.temporary]: To(),
    [ee.standby]: To()
  }
}, lx = {
  settings: {
    throttlingDelay: 10,
    controlsPosition: "top-left"
  },
  layerStyles: ux,
  controls: {
    draw: {
      marker: {
        title: "Marker",
        icon: Mt.marker,
        uiEnabled: !0,
        active: !1
      },
      circle_marker: {
        title: "Circle Marker",
        icon: Mt.circle_marker,
        uiEnabled: !0,
        active: !1
      },
      text_marker: {
        title: "Text Marker",
        icon: Mt.text_marker,
        uiEnabled: !0,
        active: !1
      },
      circle: {
        title: "Circle",
        icon: Mt.circle,
        uiEnabled: !0,
        active: !1
      },
      line: {
        title: "Line",
        icon: Mt.line,
        uiEnabled: !0,
        active: !1
      },
      rectangle: {
        title: "Rectangle",
        icon: Mt.rectangle,
        uiEnabled: !0,
        active: !1
      },
      polygon: {
        title: "Polygon",
        icon: Mt.polygon,
        uiEnabled: !0,
        active: !1
      }
    },
    edit: {
      drag: {
        title: "Drag",
        icon: Mt.drag,
        uiEnabled: !0,
        active: !1
      },
      change: {
        title: "Change",
        icon: Mt.change,
        uiEnabled: !0,
        active: !1
      },
      rotate: {
        title: "Rotate",
        icon: Mt.rotate,
        uiEnabled: !0,
        active: !1
      },
      cut: {
        title: "Cut",
        icon: Mt.cut,
        uiEnabled: !0,
        active: !1
      },
      delete: {
        title: "Delete",
        icon: Mt.delete,
        uiEnabled: !0,
        active: !1
      }
    },
    helper: {
      shape_markers: {
        title: "Shape markers",
        icon: null,
        uiEnabled: !0,
        active: !1
      },
      snapping: {
        title: "Snapping",
        icon: Mt.snapping,
        uiEnabled: !0,
        active: !1
      },
      zoom_to_features: {
        title: "Zoom to features",
        icon: Mt.zoom_to_features,
        uiEnabled: !0,
        active: !1
      }
    }
  }
}, bg = () => hn(lx), ch = !1;
var Ku = Array.isArray, cx = Array.prototype.indexOf, Qu = Array.from, Tg = Object.defineProperty, os = Object.getOwnPropertyDescriptor, Lg = Object.getOwnPropertyDescriptors, hx = Object.prototype, fx = Array.prototype, el = Object.getPrototypeOf;
const si = () => {
};
function gx(n) {
  return n();
}
function au(n) {
  for (var r = 0; r < n.length; r++)
    n[r]();
}
const fn = 2, Cg = 4, Xa = 8, tl = 16, Zn = 32, Ss = 64, Ea = 128, Wt = 256, xa = 512, yt = 1024, jn = 2048, _i = 4096, Yn = 8192, Wa = 16384, dx = 32768, nl = 65536, px = 1 << 19, Ag = 1 << 20, Tr = Symbol("$state"), mx = Symbol("");
let wa = [];
function vx() {
  var n = wa;
  wa = [], au(n);
}
function yx(n) {
  wa.length === 0 && queueMicrotask(vx), wa.push(n);
}
function Ng(n) {
  return n === this.v;
}
function Og(n, r) {
  return n != n ? r == r : n !== r || n !== null && typeof n == "object" || typeof n == "function";
}
function Pg(n) {
  return !Og(n, this.v);
}
function _x(n) {
  throw new Error("https://svelte.dev/e/effect_in_teardown");
}
function Ex() {
  throw new Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function xx(n) {
  throw new Error("https://svelte.dev/e/effect_orphan");
}
function wx() {
  throw new Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function kx() {
  throw new Error("https://svelte.dev/e/state_descriptors_fixed");
}
function Sx() {
  throw new Error("https://svelte.dev/e/state_prototype_fixed");
}
function Mx() {
  throw new Error("https://svelte.dev/e/state_unsafe_local_read");
}
function Ix() {
  throw new Error("https://svelte.dev/e/state_unsafe_mutation");
}
let Ms = !1, bx = !1;
function Tx() {
  Ms = !0;
}
const rl = 1, il = 2, Rg = 4, Lx = 8, Cx = 16, Ax = 1, Nx = 2, It = Symbol();
function sl(n) {
  throw new Error("https://svelte.dev/e/lifecycle_outside_component");
}
let Re = null;
function hh(n) {
  Re = n;
}
function al(n) {
  return (
    /** @type {T} */
    Ox().get(n)
  );
}
function Ei(n, r = !1, e) {
  Re = {
    p: Re,
    c: null,
    e: null,
    m: !1,
    s: n,
    x: null,
    l: null
  }, Ms && !r && (Re.l = {
    s: null,
    u: null,
    r1: [],
    r2: Ot(!1)
  });
}
function xi(n) {
  const r = Re;
  if (r !== null) {
    const f = r.e;
    if (f !== null) {
      var e = Ge, s = De;
      r.e = null;
      try {
        for (var u = 0; u < f.length; u++) {
          var c = f[u];
          hr(c.effect), cr(c.reaction), eo(c.fn);
        }
      } finally {
        hr(e), cr(s);
      }
    }
    Re = r.p, r.m = !0;
  }
  return (
    /** @type {T} */
    {}
  );
}
function Za() {
  return !Ms || Re !== null && Re.l === null;
}
function Ox(n) {
  return Re === null && sl(), Re.c ?? (Re.c = new Map(Px(Re) || void 0));
}
function Px(n) {
  let r = n.p;
  for (; r !== null; ) {
    const e = r.c;
    if (e !== null)
      return e;
    r = r.p;
  }
  return null;
}
function Ot(n, r) {
  var e = {
    f: 0,
    // TODO ideally we could skip this altogether, but it causes type errors
    v: n,
    reactions: null,
    equals: Ng,
    rv: 0,
    wv: 0
  };
  return e;
}
function Dg(n) {
  return /* @__PURE__ */ Fg(Ot(n));
}
// @__NO_SIDE_EFFECTS__
function ol(n, r = !1) {
  var s;
  const e = Ot(n);
  return r || (e.equals = Pg), Ms && Re !== null && Re.l !== null && ((s = Re.l).s ?? (s.s = [])).push(e), e;
}
function Rx(n, r = !1) {
  return /* @__PURE__ */ Fg(/* @__PURE__ */ ol(n, r));
}
// @__NO_SIDE_EFFECTS__
function Fg(n) {
  return De !== null && !un && (De.f & fn) !== 0 && (bn === null ? qx([n]) : bn.push(n)), n;
}
function ut(n, r) {
  return De !== null && !un && Za() && (De.f & (fn | tl)) !== 0 && // If the source was created locally within the current derived, then
  // we allow the mutation.
  (bn === null || !bn.includes(n)) && Ix(), ou(n, r);
}
function ou(n, r) {
  return n.equals(r) || (n.v, n.v = r, n.wv = Vg(), Gg(n, jn), Za() && Ge !== null && (Ge.f & yt) !== 0 && (Ge.f & (Zn | Ss)) === 0 && (Bn === null ? Yx([n]) : Bn.push(n))), r;
}
function Gg(n, r) {
  var e = n.reactions;
  if (e !== null)
    for (var s = Za(), u = e.length, c = 0; c < u; c++) {
      var f = e[c], h = f.f;
      (h & jn) === 0 && (!s && f === Ge || (An(f, r), (h & (yt | Wt)) !== 0 && ((h & fn) !== 0 ? Gg(
        /** @type {Derived} */
        f,
        _i
      ) : Qa(
        /** @type {Effect} */
        f
      ))));
    }
}
// @__NO_SIDE_EFFECTS__
function ul(n) {
  var r = fn | jn, e = De !== null && (De.f & fn) !== 0 ? (
    /** @type {Derived} */
    De
  ) : null;
  return Ge === null || e !== null && (e.f & Wt) !== 0 ? r |= Wt : Ge.f |= Ag, {
    ctx: Re,
    deps: null,
    effects: null,
    equals: Ng,
    f: r,
    fn: n,
    reactions: null,
    rv: 0,
    v: (
      /** @type {V} */
      null
    ),
    wv: 0,
    parent: e ?? Ge
  };
}
// @__NO_SIDE_EFFECTS__
function Bg(n) {
  const r = /* @__PURE__ */ ul(n);
  return r.equals = Pg, r;
}
function Ug(n) {
  var r = n.effects;
  if (r !== null) {
    n.effects = null;
    for (var e = 0; e < r.length; e += 1)
      Hn(
        /** @type {Effect} */
        r[e]
      );
  }
}
function Dx(n) {
  for (var r = n.parent; r !== null; ) {
    if ((r.f & fn) === 0)
      return (
        /** @type {Effect} */
        r
      );
    r = r.parent;
  }
  return null;
}
function Fx(n) {
  var r, e = Ge;
  hr(Dx(n));
  try {
    Ug(n), r = Wg(n);
  } finally {
    hr(e);
  }
  return r;
}
function zg(n) {
  var r = Fx(n), e = (ar || (n.f & Wt) !== 0) && n.deps !== null ? _i : yt;
  An(n, e), n.equals(r) || (n.v = r, n.wv = Vg());
}
let Gx = !1;
function kn(n, r = null, e) {
  if (typeof n != "object" || n === null || Tr in n)
    return n;
  const s = el(n);
  if (s !== hx && s !== fx)
    return n;
  var u = /* @__PURE__ */ new Map(), c = Ku(n), f = Ot(0);
  c && u.set("length", Ot(
    /** @type {any[]} */
    n.length
  ));
  var h;
  return new Proxy(
    /** @type {any} */
    n,
    {
      defineProperty(m, d, y) {
        (!("value" in y) || y.configurable === !1 || y.enumerable === !1 || y.writable === !1) && kx();
        var _ = u.get(d);
        return _ === void 0 ? (_ = Ot(y.value), u.set(d, _)) : ut(_, kn(y.value, h)), !0;
      },
      deleteProperty(m, d) {
        var y = u.get(d);
        if (y === void 0)
          d in m && u.set(d, Ot(It));
        else {
          if (c && typeof d == "string") {
            var _ = (
              /** @type {Source<number>} */
              u.get("length")
            ), E = Number(d);
            Number.isInteger(E) && E < _.v && ut(_, E);
          }
          ut(y, It), fh(f);
        }
        return !0;
      },
      get(m, d, y) {
        var I;
        if (d === Tr)
          return n;
        var _ = u.get(d), E = d in m;
        if (_ === void 0 && (!E || (I = os(m, d)) != null && I.writable) && (_ = Ot(kn(E ? m[d] : It, h)), u.set(d, _)), _ !== void 0) {
          var S = Ae(_);
          return S === It ? void 0 : S;
        }
        return Reflect.get(m, d, y);
      },
      getOwnPropertyDescriptor(m, d) {
        var y = Reflect.getOwnPropertyDescriptor(m, d);
        if (y && "value" in y) {
          var _ = u.get(d);
          _ && (y.value = Ae(_));
        } else if (y === void 0) {
          var E = u.get(d), S = E == null ? void 0 : E.v;
          if (E !== void 0 && S !== It)
            return {
              enumerable: !0,
              configurable: !0,
              value: S,
              writable: !0
            };
        }
        return y;
      },
      has(m, d) {
        var S;
        if (d === Tr)
          return !0;
        var y = u.get(d), _ = y !== void 0 && y.v !== It || Reflect.has(m, d);
        if (y !== void 0 || Ge !== null && (!_ || (S = os(m, d)) != null && S.writable)) {
          y === void 0 && (y = Ot(_ ? kn(m[d], h) : It), u.set(d, y));
          var E = Ae(y);
          if (E === It)
            return !1;
        }
        return _;
      },
      set(m, d, y, _) {
        var H;
        var E = u.get(d), S = d in m;
        if (c && d === "length")
          for (var I = y; I < /** @type {Source<number>} */
          E.v; I += 1) {
            var D = u.get(I + "");
            D !== void 0 ? ut(D, It) : I in m && (D = Ot(It), u.set(I + "", D));
          }
        E === void 0 ? (!S || (H = os(m, d)) != null && H.writable) && (E = Ot(void 0), ut(E, kn(y, h)), u.set(d, E)) : (S = E.v !== It, ut(E, kn(y, h)));
        var q = Reflect.getOwnPropertyDescriptor(m, d);
        if (q != null && q.set && q.set.call(_, y), !S) {
          if (c && typeof d == "string") {
            var G = (
              /** @type {Source<number>} */
              u.get("length")
            ), M = Number(d);
            Number.isInteger(M) && M >= G.v && ut(G, M + 1);
          }
          fh(f);
        }
        return !0;
      },
      ownKeys(m) {
        Ae(f);
        var d = Reflect.ownKeys(m).filter((E) => {
          var S = u.get(E);
          return S === void 0 || S.v !== It;
        });
        for (var [y, _] of u)
          _.v !== It && !(y in m) && d.push(y);
        return d;
      },
      setPrototypeOf() {
        Sx();
      }
    }
  );
}
function fh(n, r = 1) {
  ut(n, n.v + r);
}
function gh(n) {
  return n !== null && typeof n == "object" && Tr in n ? n[Tr] : n;
}
function Bx(n, r) {
  return Object.is(gh(n), gh(r));
}
var dh, qg, Yg, Hg;
function Ux() {
  if (dh === void 0) {
    dh = window, qg = /Firefox/.test(navigator.userAgent);
    var n = Element.prototype, r = Node.prototype;
    Yg = os(r, "firstChild").get, Hg = os(r, "nextSibling").get, n.__click = void 0, n.__className = void 0, n.__attributes = null, n.__styles = null, n.__e = void 0, Text.prototype.__t = void 0;
  }
}
function ja(n = "") {
  return document.createTextNode(n);
}
// @__NO_SIDE_EFFECTS__
function ps(n) {
  return Yg.call(n);
}
// @__NO_SIDE_EFFECTS__
function $a(n) {
  return Hg.call(n);
}
function sr(n, r) {
  return /* @__PURE__ */ ps(n);
}
function lr(n, r) {
  {
    var e = (
      /** @type {DocumentFragment} */
      /* @__PURE__ */ ps(
        /** @type {Node} */
        n
      )
    );
    return e instanceof Comment && e.data === "" ? /* @__PURE__ */ $a(e) : e;
  }
}
function ka(n, r = 1, e = !1) {
  let s = n;
  for (; r--; )
    s = /** @type {TemplateNode} */
    /* @__PURE__ */ $a(s);
  return s;
}
function zx(n) {
  n.textContent = "";
}
let ra = !1, uu = !1, Sa = null, ia = !1, ll = !1;
function ph(n) {
  ll = n;
}
let sa = [];
let De = null, un = !1;
function cr(n) {
  De = n;
}
let Ge = null;
function hr(n) {
  Ge = n;
}
let bn = null;
function qx(n) {
  bn = n;
}
let mt = null, Nt = 0, Bn = null;
function Yx(n) {
  Bn = n;
}
let Jg = 1, Ma = 0, ar = !1;
function Vg() {
  return ++Jg;
}
function Is(n) {
  var _;
  var r = n.f;
  if ((r & jn) !== 0)
    return !0;
  if ((r & _i) !== 0) {
    var e = n.deps, s = (r & Wt) !== 0;
    if (e !== null) {
      var u, c, f = (r & xa) !== 0, h = s && Ge !== null && !ar, m = e.length;
      if (f || h) {
        var d = (
          /** @type {Derived} */
          n
        ), y = d.parent;
        for (u = 0; u < m; u++)
          c = e[u], (f || !((_ = c == null ? void 0 : c.reactions) != null && _.includes(d))) && (c.reactions ?? (c.reactions = [])).push(d);
        f && (d.f ^= xa), h && y !== null && (y.f & Wt) === 0 && (d.f ^= Wt);
      }
      for (u = 0; u < m; u++)
        if (c = e[u], Is(
          /** @type {Derived} */
          c
        ) && zg(
          /** @type {Derived} */
          c
        ), c.wv > n.wv)
          return !0;
    }
    (!s || Ge !== null && !ar) && An(n, yt);
  }
  return !1;
}
function Hx(n, r) {
  for (var e = r; e !== null; ) {
    if ((e.f & Ea) !== 0)
      try {
        e.fn(n);
        return;
      } catch {
        e.f ^= Ea;
      }
    e = e.parent;
  }
  throw ra = !1, n;
}
function Jx(n) {
  return (n.f & Wa) === 0 && (n.parent === null || (n.parent.f & Ea) === 0);
}
function Ka(n, r, e, s) {
  if (ra) {
    if (e === null && (ra = !1), Jx(r))
      throw n;
    return;
  }
  e !== null && (ra = !0);
  {
    Hx(n, r);
    return;
  }
}
function Xg(n, r, e = !0) {
  var s = n.reactions;
  if (s !== null)
    for (var u = 0; u < s.length; u++) {
      var c = s[u];
      (c.f & fn) !== 0 ? Xg(
        /** @type {Derived} */
        c,
        r,
        !1
      ) : r === c && (e ? An(c, jn) : (c.f & yt) !== 0 && An(c, _i), Qa(
        /** @type {Effect} */
        c
      ));
    }
}
function Wg(n) {
  var S;
  var r = mt, e = Nt, s = Bn, u = De, c = ar, f = bn, h = Re, m = un, d = n.f;
  mt = /** @type {null | Value[]} */
  null, Nt = 0, Bn = null, ar = (d & Wt) !== 0 && (un || !ia || De === null), De = (d & (Zn | Ss)) === 0 ? n : null, bn = null, hh(n.ctx), un = !1, Ma++;
  try {
    var y = (
      /** @type {Function} */
      (0, n.fn)()
    ), _ = n.deps;
    if (mt !== null) {
      var E;
      if (Ia(n, Nt), _ !== null && Nt > 0)
        for (_.length = Nt + mt.length, E = 0; E < mt.length; E++)
          _[Nt + E] = mt[E];
      else
        n.deps = _ = mt;
      if (!ar)
        for (E = Nt; E < _.length; E++)
          ((S = _[E]).reactions ?? (S.reactions = [])).push(n);
    } else _ !== null && Nt < _.length && (Ia(n, Nt), _.length = Nt);
    if (Za() && Bn !== null && !un && _ !== null && (n.f & (fn | _i | jn)) === 0)
      for (E = 0; E < /** @type {Source[]} */
      Bn.length; E++)
        Xg(
          Bn[E],
          /** @type {Effect} */
          n
        );
    return u !== null && Ma++, y;
  } finally {
    mt = r, Nt = e, Bn = s, De = u, ar = c, bn = f, hh(h), un = m;
  }
}
function Vx(n, r) {
  let e = r.reactions;
  if (e !== null) {
    var s = cx.call(e, n);
    if (s !== -1) {
      var u = e.length - 1;
      u === 0 ? e = r.reactions = null : (e[s] = e[u], e.pop());
    }
  }
  e === null && (r.f & fn) !== 0 && // Destroying a child effect while updating a parent effect can cause a dependency to appear
  // to be unused, when in fact it is used by the currently-updating parent. Checking `new_deps`
  // allows us to skip the expensive work of disconnecting and immediately reconnecting it
  (mt === null || !mt.includes(r)) && (An(r, _i), (r.f & (Wt | xa)) === 0 && (r.f ^= xa), Ug(
    /** @type {Derived} **/
    r
  ), Ia(
    /** @type {Derived} **/
    r,
    0
  ));
}
function Ia(n, r) {
  var e = n.deps;
  if (e !== null)
    for (var s = r; s < e.length; s++)
      Vx(n, e[s]);
}
function cl(n) {
  var r = n.f;
  if ((r & Wa) === 0) {
    An(n, yt);
    var e = Ge, s = Re, u = ia;
    Ge = n, ia = !0;
    try {
      (r & tl) !== 0 ? rw(n) : Kg(n), $g(n);
      var c = Wg(n);
      n.teardown = typeof c == "function" ? c : null, n.wv = Jg;
      var f = n.deps, h;
      ch && bx && n.f & jn;
    } catch (m) {
      Ka(m, n, e, s || n.ctx);
    } finally {
      ia = u, Ge = e;
    }
  }
}
function Xx() {
  try {
    wx();
  } catch (n) {
    if (Sa !== null)
      Ka(n, Sa, null);
    else
      throw n;
  }
}
function Wx() {
  try {
    for (var n = 0; sa.length > 0; ) {
      n++ > 1e3 && Xx();
      var r = sa, e = r.length;
      sa = [];
      for (var s = 0; s < e; s++) {
        var u = r[s];
        (u.f & yt) === 0 && (u.f ^= yt);
        var c = jx(u);
        Zx(c);
      }
    }
  } finally {
    uu = !1, Sa = null;
  }
}
function Zx(n) {
  var r = n.length;
  if (r !== 0)
    for (var e = 0; e < r; e++) {
      var s = n[e];
      if ((s.f & (Wa | Yn)) === 0)
        try {
          Is(s) && (cl(s), s.deps === null && s.first === null && s.nodes_start === null && (s.teardown === null ? Qg(s) : s.fn = null));
        } catch (u) {
          Ka(u, s, null, s.ctx);
        }
    }
}
function Qa(n) {
  uu || (uu = !0, queueMicrotask(Wx));
  for (var r = Sa = n; r.parent !== null; ) {
    r = r.parent;
    var e = r.f;
    if ((e & (Ss | Zn)) !== 0) {
      if ((e & yt) === 0) return;
      r.f ^= yt;
    }
  }
  sa.push(r);
}
function jx(n) {
  for (var r = [], e = n.first; e !== null; ) {
    var s = e.f, u = (s & Zn) !== 0, c = u && (s & yt) !== 0;
    if (!c && (s & Yn) === 0) {
      if ((s & Cg) !== 0)
        r.push(e);
      else if (u)
        e.f ^= yt;
      else {
        var f = De;
        try {
          De = e, Is(e) && cl(e);
        } catch (d) {
          Ka(d, e, null, e.ctx);
        } finally {
          De = f;
        }
      }
      var h = e.first;
      if (h !== null) {
        e = h;
        continue;
      }
    }
    var m = e.parent;
    for (e = e.next; e === null && m !== null; )
      e = m.next, m = m.parent;
  }
  return r;
}
function Ae(n) {
  var r = n.f, e = (r & fn) !== 0;
  if (De !== null && !un) {
    bn !== null && bn.includes(n) && Mx();
    var s = De.deps;
    n.rv < Ma && (n.rv = Ma, mt === null && s !== null && s[Nt] === n ? Nt++ : mt === null ? mt = [n] : (!ar || !mt.includes(n)) && mt.push(n));
  } else if (e && /** @type {Derived} */
  n.deps === null && /** @type {Derived} */
  n.effects === null) {
    var u = (
      /** @type {Derived} */
      n
    ), c = u.parent;
    c !== null && (c.f & Wt) === 0 && (u.f ^= Wt);
  }
  return e && (u = /** @type {Derived} */
  n, Is(u) && zg(u)), n.v;
}
function bs(n) {
  var r = un;
  try {
    return un = !0, n();
  } finally {
    un = r;
  }
}
const $x = -7169;
function An(n, r) {
  n.f = n.f & $x | r;
}
function Kx(n) {
  if (!(typeof n != "object" || !n || n instanceof EventTarget)) {
    if (Tr in n)
      lu(n);
    else if (!Array.isArray(n))
      for (let r in n) {
        const e = n[r];
        typeof e == "object" && e && Tr in e && lu(e);
      }
  }
}
function lu(n, r = /* @__PURE__ */ new Set()) {
  if (typeof n == "object" && n !== null && // We don't want to traverse DOM elements
  !(n instanceof EventTarget) && !r.has(n)) {
    r.add(n), n instanceof Date && n.getTime();
    for (let s in n)
      try {
        lu(n[s], r);
      } catch {
      }
    const e = el(n);
    if (e !== Object.prototype && e !== Array.prototype && e !== Map.prototype && e !== Set.prototype && e !== Date.prototype) {
      const s = Lg(e);
      for (let u in s) {
        const c = s[u].get;
        if (c)
          try {
            c.call(n);
          } catch {
          }
      }
    }
  }
}
function Zg(n) {
  Ge === null && De === null && xx(), De !== null && (De.f & Wt) !== 0 && Ge === null && Ex(), ll && _x();
}
function Qx(n, r) {
  var e = r.last;
  e === null ? r.last = r.first = n : (e.next = n, n.prev = e, r.last = n);
}
function wi(n, r, e, s = !0) {
  var u = (n & Ss) !== 0, c = Ge, f = {
    ctx: Re,
    deps: null,
    nodes_start: null,
    nodes_end: null,
    f: n | jn,
    first: null,
    fn: r,
    last: null,
    next: null,
    parent: u ? null : c,
    prev: null,
    teardown: null,
    transitions: null,
    wv: 0
  };
  if (e)
    try {
      cl(f), f.f |= dx;
    } catch (d) {
      throw Hn(f), d;
    }
  else r !== null && Qa(f);
  var h = e && f.deps === null && f.first === null && f.nodes_start === null && f.teardown === null && (f.f & (Ag | Ea)) === 0;
  if (!h && !u && s && (c !== null && Qx(f, c), De !== null && (De.f & fn) !== 0)) {
    var m = (
      /** @type {Derived} */
      De
    );
    (m.effects ?? (m.effects = [])).push(f);
  }
  return f;
}
function ew(n) {
  const r = wi(Xa, null, !1);
  return An(r, yt), r.teardown = n, r;
}
function cu(n) {
  Zg();
  var r = Ge !== null && (Ge.f & Zn) !== 0 && Re !== null && !Re.m;
  if (r) {
    var e = (
      /** @type {ComponentContext} */
      Re
    );
    (e.e ?? (e.e = [])).push({
      fn: n,
      effect: Ge,
      reaction: De
    });
  } else {
    var s = eo(n);
    return s;
  }
}
function tw(n) {
  return Zg(), jg(n);
}
function nw(n) {
  const r = wi(Ss, n, !0);
  return (e = {}) => new Promise((s) => {
    e.outro ? ba(r, () => {
      Hn(r), s(void 0);
    }) : (Hn(r), s(void 0));
  });
}
function eo(n) {
  return wi(Cg, n, !1);
}
function jg(n) {
  return wi(Xa, n, !0);
}
function zn(n, r = [], e = ul) {
  const s = r.map(e);
  return to(() => n(...s.map(Ae)));
}
function to(n, r = 0) {
  return wi(Xa | tl | r, n, !0);
}
function pi(n, r = !0) {
  return wi(Xa | Zn, n, !0, r);
}
function $g(n) {
  var r = n.teardown;
  if (r !== null) {
    const e = ll, s = De;
    ph(!0), cr(null);
    try {
      r.call(null);
    } finally {
      ph(e), cr(s);
    }
  }
}
function Kg(n, r = !1) {
  var e = n.first;
  for (n.first = n.last = null; e !== null; ) {
    var s = e.next;
    Hn(e, r), e = s;
  }
}
function rw(n) {
  for (var r = n.first; r !== null; ) {
    var e = r.next;
    (r.f & Zn) === 0 && Hn(r), r = e;
  }
}
function Hn(n, r = !0) {
  var e = !1;
  if ((r || (n.f & px) !== 0) && n.nodes_start !== null) {
    for (var s = n.nodes_start, u = n.nodes_end; s !== null; ) {
      var c = s === u ? null : (
        /** @type {TemplateNode} */
        /* @__PURE__ */ $a(s)
      );
      s.remove(), s = c;
    }
    e = !0;
  }
  Kg(n, r && !e), Ia(n, 0), An(n, Wa);
  var f = n.transitions;
  if (f !== null)
    for (const m of f)
      m.stop();
  $g(n);
  var h = n.parent;
  h !== null && h.first !== null && Qg(n), n.next = n.prev = n.teardown = n.ctx = n.deps = n.fn = n.nodes_start = n.nodes_end = null;
}
function Qg(n) {
  var r = n.parent, e = n.prev, s = n.next;
  e !== null && (e.next = s), s !== null && (s.prev = e), r !== null && (r.first === n && (r.first = s), r.last === n && (r.last = e));
}
function ba(n, r) {
  var e = [];
  hl(n, e, !0), ed(e, () => {
    Hn(n), r && r();
  });
}
function ed(n, r) {
  var e = n.length;
  if (e > 0) {
    var s = () => --e || r();
    for (var u of n)
      u.out(s);
  } else
    r();
}
function hl(n, r, e) {
  if ((n.f & Yn) === 0) {
    if (n.f ^= Yn, n.transitions !== null)
      for (const f of n.transitions)
        (f.is_global || e) && r.push(f);
    for (var s = n.first; s !== null; ) {
      var u = s.next, c = (s.f & nl) !== 0 || (s.f & Zn) !== 0;
      hl(s, r, c ? e : !1), s = u;
    }
  }
}
function Ta(n) {
  td(n, !0);
}
function td(n, r) {
  if ((n.f & Yn) !== 0) {
    n.f ^= Yn, (n.f & yt) === 0 && (n.f ^= yt), Is(n) && (An(n, jn), Qa(n));
    for (var e = n.first; e !== null; ) {
      var s = e.next, u = (e.f & nl) !== 0 || (e.f & Zn) !== 0;
      td(e, u ? r : !1), e = s;
    }
    if (n.transitions !== null)
      for (const c of n.transitions)
        (c.is_global || r) && c.in();
  }
}
const iw = ["touchstart", "touchmove"];
function sw(n) {
  return iw.includes(n);
}
let mh = !1;
function aw() {
  mh || (mh = !0, document.addEventListener(
    "reset",
    (n) => {
      Promise.resolve().then(() => {
        var r;
        if (!n.defaultPrevented)
          for (
            const e of
            /**@type {HTMLFormElement} */
            n.target.elements
          )
            (r = e.__on_r) == null || r.call(e);
      });
    },
    // In the capture phase to guarantee we get noticed of it (no possiblity of stopPropagation)
    { capture: !0 }
  ));
}
function ow(n) {
  var r = De, e = Ge;
  cr(null), hr(null);
  try {
    return n();
  } finally {
    cr(r), hr(e);
  }
}
function nd(n, r, e, s = e) {
  n.addEventListener(r, () => ow(e));
  const u = n.__on_r;
  u ? n.__on_r = () => {
    u(), s(!0);
  } : n.__on_r = () => s(!0), aw();
}
const rd = /* @__PURE__ */ new Set(), hu = /* @__PURE__ */ new Set();
function fl(n) {
  for (var r = 0; r < n.length; r++)
    rd.add(n[r]);
  for (var e of hu)
    e(n);
}
function Ys(n) {
  var M;
  var r = this, e = (
    /** @type {Node} */
    r.ownerDocument
  ), s = n.type, u = ((M = n.composedPath) == null ? void 0 : M.call(n)) || [], c = (
    /** @type {null | Element} */
    u[0] || n.target
  ), f = 0, h = n.__root;
  if (h) {
    var m = u.indexOf(h);
    if (m !== -1 && (r === document || r === /** @type {any} */
    window)) {
      n.__root = r;
      return;
    }
    var d = u.indexOf(r);
    if (d === -1)
      return;
    m <= d && (f = m);
  }
  if (c = /** @type {Element} */
  u[f] || n.target, c !== r) {
    Tg(n, "currentTarget", {
      configurable: !0,
      get() {
        return c || e;
      }
    });
    var y = De, _ = Ge;
    cr(null), hr(null);
    try {
      for (var E, S = []; c !== null; ) {
        var I = c.assignedSlot || c.parentNode || /** @type {any} */
        c.host || null;
        try {
          var D = c["__" + s];
          if (D !== void 0 && (!/** @type {any} */
          c.disabled || // DOM could've been updated already by the time this is reached, so we check this as well
          // -> the target could not have been disabled because it emits the event in the first place
          n.target === c))
            if (Ku(D)) {
              var [q, ...G] = D;
              q.apply(c, [n, ...G]);
            } else
              D.call(c, n);
        } catch (H) {
          E ? S.push(H) : E = H;
        }
        if (n.cancelBubble || I === r || I === null)
          break;
        c = I;
      }
      if (E) {
        for (let H of S)
          queueMicrotask(() => {
            throw H;
          });
        throw E;
      }
    } finally {
      n.__root = r, delete n.currentTarget, cr(y), hr(_);
    }
  }
}
function id(n) {
  var r = document.createElement("template");
  return r.innerHTML = n, r.content;
}
function ms(n, r) {
  var e = (
    /** @type {Effect} */
    Ge
  );
  e.nodes_start === null && (e.nodes_start = n, e.nodes_end = r);
}
// @__NO_SIDE_EFFECTS__
function dn(n, r) {
  var e = (r & Ax) !== 0, s = (r & Nx) !== 0, u, c = !n.startsWith("<!>");
  return () => {
    u === void 0 && (u = id(c ? n : "<!>" + n), e || (u = /** @type {Node} */
    /* @__PURE__ */ ps(u)));
    var f = (
      /** @type {TemplateNode} */
      s || qg ? document.importNode(u, !0) : u.cloneNode(!0)
    );
    if (e) {
      var h = (
        /** @type {TemplateNode} */
        /* @__PURE__ */ ps(f)
      ), m = (
        /** @type {TemplateNode} */
        f.lastChild
      );
      ms(h, m);
    } else
      ms(f, f);
    return f;
  };
}
function vh(n = "") {
  {
    var r = ja(n + "");
    return ms(r, r), r;
  }
}
function mi() {
  var n = document.createDocumentFragment(), r = document.createComment(""), e = ja();
  return n.append(r, e), ms(r, e), n;
}
function Qe(n, r) {
  n !== null && n.before(
    /** @type {Node} */
    r
  );
}
function ai(n, r) {
  var e = r == null ? "" : typeof r == "object" ? r + "" : r;
  e !== (n.__t ?? (n.__t = n.nodeValue)) && (n.__t = e, n.nodeValue = e + "");
}
function uw(n, r) {
  return lw(n, r);
}
const $r = /* @__PURE__ */ new Map();
function lw(n, { target: r, anchor: e, props: s = {}, events: u, context: c, intro: f = !0 }) {
  Ux();
  var h = /* @__PURE__ */ new Set(), m = (_) => {
    for (var E = 0; E < _.length; E++) {
      var S = _[E];
      if (!h.has(S)) {
        h.add(S);
        var I = sw(S);
        r.addEventListener(S, Ys, { passive: I });
        var D = $r.get(S);
        D === void 0 ? (document.addEventListener(S, Ys, { passive: I }), $r.set(S, 1)) : $r.set(S, D + 1);
      }
    }
  };
  m(Qu(rd)), hu.add(m);
  var d = void 0, y = nw(() => {
    var _ = e ?? r.appendChild(ja());
    return pi(() => {
      if (c) {
        Ei({});
        var E = (
          /** @type {ComponentContext} */
          Re
        );
        E.c = c;
      }
      u && (s.$$events = u), d = n(_, s) || {}, c && xi();
    }), () => {
      var I;
      for (var E of h) {
        r.removeEventListener(E, Ys);
        var S = (
          /** @type {number} */
          $r.get(E)
        );
        --S === 0 ? (document.removeEventListener(E, Ys), $r.delete(E)) : $r.set(E, S);
      }
      hu.delete(m), _ !== e && ((I = _.parentNode) == null || I.removeChild(_));
    };
  });
  return fu.set(d, y), d;
}
let fu = /* @__PURE__ */ new WeakMap();
function cw(n, r) {
  const e = fu.get(n);
  return e ? (fu.delete(n), e(r)) : Promise.resolve();
}
function Mn(n, r, [e, s] = [0, 0]) {
  var u = n, c = null, f = null, h = It, m = e > 0 ? nl : 0, d = !1;
  const y = (E, S = !0) => {
    d = !0, _(S, E);
  }, _ = (E, S) => {
    h !== (h = E) && (h ? (c ? Ta(c) : S && (c = pi(() => S(u))), f && ba(f, () => {
      f = null;
    })) : (f ? Ta(f) : S && (f = pi(() => S(u, [e + 1, s]))), c && ba(c, () => {
      c = null;
    })));
  };
  to(() => {
    d = !1, r(y), d || _(null, null);
  }, m);
}
function vs(n, r) {
  return r;
}
function hw(n, r, e, s) {
  for (var u = [], c = r.length, f = 0; f < c; f++)
    hl(r[f].e, u, !0);
  var h = c > 0 && u.length === 0 && e !== null;
  if (h) {
    var m = (
      /** @type {Element} */
      /** @type {Element} */
      e.parentNode
    );
    zx(m), m.append(
      /** @type {Element} */
      e
    ), s.clear(), ir(n, r[0].prev, r[c - 1].next);
  }
  ed(u, () => {
    for (var d = 0; d < c; d++) {
      var y = r[d];
      h || (s.delete(y.k), ir(n, y.prev, y.next)), Hn(y.e, !h);
    }
  });
}
function ys(n, r, e, s, u, c = null) {
  var f = n, h = { flags: r, items: /* @__PURE__ */ new Map(), first: null }, m = (r & Rg) !== 0;
  if (m) {
    var d = (
      /** @type {Element} */
      n
    );
    f = d.appendChild(ja());
  }
  var y = null, _ = !1, E = /* @__PURE__ */ Bg(() => {
    var S = e();
    return Ku(S) ? S : S == null ? [] : Qu(S);
  });
  to(() => {
    var S = Ae(E), I = S.length;
    _ && I === 0 || (_ = I === 0, fw(S, h, f, u, r, s, e), c !== null && (I === 0 ? y ? Ta(y) : y = pi(() => c(f)) : y !== null && ba(y, () => {
      y = null;
    })), Ae(E));
  });
}
function fw(n, r, e, s, u, c, f) {
  var O, N, P, Y;
  var h = (u & Lx) !== 0, m = (u & (rl | il)) !== 0, d = n.length, y = r.items, _ = r.first, E = _, S, I = null, D, q = [], G = [], M, H, V, X;
  if (h)
    for (X = 0; X < d; X += 1)
      M = n[X], H = c(M, X), V = y.get(H), V !== void 0 && ((O = V.a) == null || O.measure(), (D ?? (D = /* @__PURE__ */ new Set())).add(V));
  for (X = 0; X < d; X += 1) {
    if (M = n[X], H = c(M, X), V = y.get(H), V === void 0) {
      var j = E ? (
        /** @type {TemplateNode} */
        E.e.nodes_start
      ) : e;
      I = dw(
        j,
        r,
        I,
        I === null ? r.first : I.next,
        M,
        H,
        X,
        s,
        u,
        f
      ), y.set(H, I), q = [], G = [], E = I.next;
      continue;
    }
    if (m && gw(V, M, X, u), (V.e.f & Yn) !== 0 && (Ta(V.e), h && ((N = V.a) == null || N.unfix(), (D ?? (D = /* @__PURE__ */ new Set())).delete(V))), V !== E) {
      if (S !== void 0 && S.has(V)) {
        if (q.length < G.length) {
          var $ = G[0], x;
          I = $.prev;
          var k = q[0], T = q[q.length - 1];
          for (x = 0; x < q.length; x += 1)
            yh(q[x], $, e);
          for (x = 0; x < G.length; x += 1)
            S.delete(G[x]);
          ir(r, k.prev, T.next), ir(r, I, k), ir(r, T, $), E = $, I = T, X -= 1, q = [], G = [];
        } else
          S.delete(V), yh(V, E, e), ir(r, V.prev, V.next), ir(r, V, I === null ? r.first : I.next), ir(r, I, V), I = V;
        continue;
      }
      for (q = [], G = []; E !== null && E.k !== H; )
        (E.e.f & Yn) === 0 && (S ?? (S = /* @__PURE__ */ new Set())).add(E), G.push(E), E = E.next;
      if (E === null)
        continue;
      V = E;
    }
    q.push(V), I = V, E = V.next;
  }
  if (E !== null || S !== void 0) {
    for (var L = S === void 0 ? [] : Qu(S); E !== null; )
      (E.e.f & Yn) === 0 && L.push(E), E = E.next;
    var A = L.length;
    if (A > 0) {
      var F = (u & Rg) !== 0 && d === 0 ? e : null;
      if (h) {
        for (X = 0; X < A; X += 1)
          (P = L[X].a) == null || P.measure();
        for (X = 0; X < A; X += 1)
          (Y = L[X].a) == null || Y.fix();
      }
      hw(r, L, F, y);
    }
  }
  h && yx(() => {
    var U;
    if (D !== void 0)
      for (V of D)
        (U = V.a) == null || U.apply();
  }), Ge.first = r.first && r.first.e, Ge.last = I && I.e;
}
function gw(n, r, e, s) {
  (s & rl) !== 0 && ou(n.v, r), (s & il) !== 0 ? ou(
    /** @type {Value<number>} */
    n.i,
    e
  ) : n.i = e;
}
function dw(n, r, e, s, u, c, f, h, m, d) {
  var y = (m & rl) !== 0, _ = (m & Cx) === 0, E = y ? _ ? /* @__PURE__ */ ol(u) : Ot(u) : u, S = (m & il) === 0 ? f : Ot(f), I = {
    i: S,
    v: E,
    k: c,
    a: null,
    // @ts-expect-error
    e: null,
    prev: e,
    next: s
  };
  try {
    return I.e = pi(() => h(n, E, S, d), Gx), I.e.prev = e && e.e, I.e.next = s && s.e, e === null ? r.first = I : (e.next = I, e.e.next = I.e), s !== null && (s.prev = I, s.e.prev = I.e), I;
  } finally {
  }
}
function yh(n, r, e) {
  for (var s = n.next ? (
    /** @type {TemplateNode} */
    n.next.e.nodes_start
  ) : e, u = r ? (
    /** @type {TemplateNode} */
    r.e.nodes_start
  ) : e, c = (
    /** @type {TemplateNode} */
    n.e.nodes_start
  ); c !== s; ) {
    var f = (
      /** @type {TemplateNode} */
      /* @__PURE__ */ $a(c)
    );
    u.before(c), c = f;
  }
}
function ir(n, r, e) {
  r === null ? n.first = e : (r.next = e, r.e.next = e && e.e), e !== null && (e.prev = r, e.e.prev = r && r.e);
}
function pw(n, r, e, s, u) {
  var c = n, f = "", h;
  to(() => {
    f !== (f = r() ?? "") && (h !== void 0 && (Hn(h), h = void 0), f !== "" && (h = pi(() => {
      var m = f + "", d = id(m);
      ms(
        /** @type {TemplateNode} */
        /* @__PURE__ */ ps(d),
        /** @type {TemplateNode} */
        d.lastChild
      ), c.before(d);
    })));
  });
}
const _h = [...` 	
\r\f \v\uFEFF`];
function mw(n, r, e) {
  var s = n == null ? "" : "" + n;
  if (r && (s = s ? s + " " + r : r), e) {
    for (var u in e)
      if (e[u])
        s = s ? s + " " + u : u;
      else if (s.length)
        for (var c = u.length, f = 0; (f = s.indexOf(u, f)) >= 0; ) {
          var h = f + c;
          (f === 0 || _h.includes(s[f - 1])) && (h === s.length || _h.includes(s[h])) ? s = (f === 0 ? "" : s.substring(0, f)) + s.substring(h + 1) : f = h;
        }
  }
  return s === "" ? null : s;
}
function gu(n, r, e, s, u, c) {
  var f = n.__className;
  if (f !== e) {
    var h = mw(e, s, c);
    h == null ? n.removeAttribute("class") : n.className = h, n.__className = e;
  } else if (c)
    for (var m in c) {
      var d = !!c[m];
      (u == null || d !== !!u[m]) && n.classList.toggle(m, d);
    }
  return c;
}
function Mr(n, r, e, s) {
  var u = n.__attributes ?? (n.__attributes = {});
  u[r] !== (u[r] = e) && (r === "style" && "__styles" in n && (n.__styles = {}), r === "loading" && (n[mx] = e), e == null ? n.removeAttribute(r) : typeof e != "string" && vw(n).includes(r) ? n[r] = e : n.setAttribute(r, e));
}
var Eh = /* @__PURE__ */ new Map();
function vw(n) {
  var r = Eh.get(n.nodeName);
  if (r) return r;
  Eh.set(n.nodeName, r = []);
  for (var e, s = n, u = Element.prototype; u !== s; ) {
    e = Lg(s);
    for (var c in e)
      e[c].set && r.push(c);
    s = el(s);
  }
  return r;
}
function yw(n, r, e = r) {
  nd(n, "change", (s) => {
    var u = s ? n.defaultChecked : n.checked;
    e(u);
  }), // If we are hydrating and the value has since changed,
  // then use the update value from the input instead.
  // If defaultChecked is set, then checked == defaultChecked
  bs(r) == null && e(n.checked), jg(() => {
    var s = r();
    n.checked = !!s;
  });
}
function sd(n, r, e) {
  if (n.multiple)
    return xw(n, r);
  for (var s of n.options) {
    var u = us(s);
    if (Bx(u, r)) {
      s.selected = !0;
      return;
    }
  }
  (!e || r !== void 0) && (n.selectedIndex = -1);
}
function _w(n, r) {
  eo(() => {
    var e = new MutationObserver(() => {
      var s = n.__value;
      sd(n, s);
    });
    return e.observe(n, {
      // Listen to option element changes
      childList: !0,
      subtree: !0,
      // because of <optgroup>
      // Listen to option element value attribute changes
      // (doesn't get notified of select value changes,
      // because that property is not reflected as an attribute)
      attributes: !0,
      attributeFilter: ["value"]
    }), () => {
      e.disconnect();
    };
  });
}
function Ew(n, r, e = r) {
  var s = !0;
  nd(n, "change", (u) => {
    var c = u ? "[selected]" : ":checked", f;
    if (n.multiple)
      f = [].map.call(n.querySelectorAll(c), us);
    else {
      var h = n.querySelector(c) ?? // will fall back to first non-disabled option if no option is selected
      n.querySelector("option:not([disabled])");
      f = h && us(h);
    }
    e(f);
  }), eo(() => {
    var u = r();
    if (sd(n, u, s), s && u === void 0) {
      var c = n.querySelector(":checked");
      c !== null && (u = us(c), e(u));
    }
    n.__value = u, s = !1;
  }), _w(n);
}
function xw(n, r) {
  for (var e of n.options)
    e.selected = ~r.indexOf(us(e));
}
function us(n) {
  return "__value" in n ? n.__value : n.value;
}
function ww(n = !1) {
  const r = (
    /** @type {ComponentContextLegacy} */
    Re
  ), e = r.l.u;
  if (!e) return;
  let s = () => Kx(r.s);
  if (n) {
    let u = 0, c = (
      /** @type {Record<string, any>} */
      {}
    );
    const f = /* @__PURE__ */ ul(() => {
      let h = !1;
      const m = r.s;
      for (const d in m)
        m[d] !== c[d] && (c[d] = m[d], h = !0);
      return h && u++, u;
    });
    s = () => Ae(f);
  }
  e.b.length && tw(() => {
    xh(r, s), au(e.b);
  }), cu(() => {
    const u = bs(() => e.m.map(gx));
    return () => {
      for (const c of u)
        typeof c == "function" && c();
    };
  }), e.a.length && cu(() => {
    xh(r, s), au(e.a);
  });
}
function xh(n, r) {
  if (n.l.s)
    for (const e of n.l.s) Ae(e);
  r();
}
let du = Symbol();
function kw(n, r, e) {
  const s = e[r] ?? (e[r] = {
    store: null,
    source: /* @__PURE__ */ ol(void 0),
    unsubscribe: si
  });
  if (s.store !== n && !(du in e))
    if (s.unsubscribe(), s.store = n ?? null, n == null)
      s.source.v = void 0, s.unsubscribe = si;
    else {
      var u = !0;
      s.unsubscribe = od(n, (c) => {
        u ? s.source.v = c : ut(s.source, c);
      }), u = !1;
    }
  return n && du in e ? Tw(n) : Ae(s.source);
}
function Sw() {
  const n = {};
  function r() {
    ew(() => {
      for (var e in n)
        n[e].unsubscribe();
      Tg(n, du, {
        enumerable: !1,
        value: !0
      });
    });
  }
  return [n, r];
}
function ad(n) {
  Re === null && sl(), Ms && Re.l !== null ? Iw(Re).m.push(n) : cu(() => {
    const r = bs(n);
    if (typeof r == "function") return (
      /** @type {() => void} */
      r
    );
  });
}
function Mw(n) {
  Re === null && sl(), ad(() => () => bs(n));
}
function Iw(n) {
  var r = (
    /** @type {ComponentContextLegacy} */
    n.l
  );
  return r.u ?? (r.u = { a: [], b: [], m: [] });
}
function od(n, r, e) {
  if (n == null)
    return r(void 0), si;
  const s = bs(
    () => n.subscribe(
      r,
      // @ts-expect-error
      e
    )
  );
  return s.unsubscribe ? () => s.unsubscribe() : s;
}
const Kr = [];
function bw(n, r = si) {
  let e = null;
  const s = /* @__PURE__ */ new Set();
  function u(h) {
    if (Og(n, h) && (n = h, e)) {
      const m = !Kr.length;
      for (const d of s)
        d[1](), Kr.push(d, n);
      if (m) {
        for (let d = 0; d < Kr.length; d += 2)
          Kr[d][0](Kr[d + 1]);
        Kr.length = 0;
      }
    }
  }
  function c(h) {
    u(h(
      /** @type {T} */
      n
    ));
  }
  function f(h, m = si) {
    const d = [h, m];
    return s.add(d), s.size === 1 && (e = r(u, c) || si), h(
      /** @type {T} */
      n
    ), () => {
      s.delete(d), s.size === 0 && e && (e(), e = null);
    };
  }
  return { set: u, update: c, subscribe: f };
}
function Tw(n) {
  let r;
  return od(n, (e) => r = e)(), r;
}
const Lw = {
  controls: hn(uf),
  options: bg().controls
}, pu = bw(Lw), Cw = "5";
typeof window < "u" && (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(Cw);
Tx();
const wh = (n, r, e) => {
  var s, u;
  if (!r.actionInstance || !r.actionOption) {
    ae.error("Can't apply option value", r.actionInstance, r.actionOption);
    return;
  }
  if (((s = r.actionOption) == null ? void 0 : s.type) === "toggle") {
    const c = n.target;
    ut(e, kn(c.checked));
  } else if (((u = r.actionOption) == null ? void 0 : u.type) === "select") {
    const c = n.target;
    ut(e, kn(c.value));
  }
  r.actionInstance.applyOptionValue(r.actionOption.name, Ae(e));
};
var Aw = /* @__PURE__ */ dn("<option> </option>"), Nw = /* @__PURE__ */ dn('<label class="svelte-1892xbw"> </label> <select class="svelte-1892xbw"></select>', 1), Ow = /* @__PURE__ */ dn('<label class="svelte-1892xbw"><input type="checkbox" class="svelte-1892xbw"> </label>'), Pw = /* @__PURE__ */ dn("<span>Unknown type</span>"), Rw = /* @__PURE__ */ dn('<div class="action-option svelte-1892xbw"><!></div>');
function Dw(n, r) {
  Ei(r, !0);
  let e = Dg("");
  ad(() => {
    r.actionOption && (r.actionOption.type === "select" ? ut(e, kn(r.actionOption.value.value)) : r.actionOption.type === "toggle" && ut(e, kn(r.actionOption.value)));
  });
  var s = mi(), u = lr(s);
  {
    var c = (f) => {
      var h = Rw(), m = sr(h);
      {
        var d = (_) => {
          var E = Nw(), S = lr(E), I = sr(S), D = ka(S, 2);
          D.__change = [wh, r, e], ys(D, 21, () => r.actionOption.choices, vs, (q, G) => {
            var M = Aw(), H = {}, V = sr(M);
            zn(() => {
              H !== (H = Ae(G).value) && (M.value = (M.__value = Ae(G).value) == null ? "" : Ae(G).value), ai(V, Ae(G).title);
            }), Qe(q, M);
          }), zn(() => {
            Mr(S, "for", r.actionOption.name), ai(I, r.actionOption.label), Mr(D, "id", r.actionOption.name);
          }), Ew(D, () => Ae(e), (q) => ut(e, q)), Qe(_, E);
        }, y = (_, E) => {
          {
            var S = (D) => {
              var q = Ow(), G = sr(q);
              G.__change = [wh, r, e];
              var M = ka(G);
              zn(
                (H) => {
                  Mr(q, "for", r.actionOption.name), Mr(G, "id", H), ai(M, ` ${r.actionOption.label ?? ""}`);
                },
                [() => String(r.actionOption.name)]
              ), yw(G, () => Ae(e), (H) => ut(e, H)), Qe(D, q);
            }, I = (D) => {
              var q = Pw();
              Qe(D, q);
            };
            Mn(
              _,
              (D) => {
                r.actionOption.type === "toggle" && typeof Ae(e) == "boolean" ? D(S) : D(I, !1);
              },
              E
            );
          }
        };
        Mn(m, (_) => {
          r.actionOption.type === "select" ? _(d) : _(y, !1);
        });
      }
      Qe(f, h);
    };
    Mn(u, (f) => {
      r.actionOption && f(c);
    });
  }
  Qe(n, s), xi();
}
fl(["change"]);
const Fw = (n, r) => {
  if (n.preventDefault(), !r.actionInstance || !r.subAction) {
    ae.error("Can't run a SubAction", r.actionInstance, r.subAction);
    return;
  }
  r.subAction.method();
};
var Gw = /* @__PURE__ */ dn('<button type="submit" class="sub-action svelte-1x28ief"> </button>');
function Bw(n, r) {
  Ei(r, !0);
  var e = mi(), s = lr(e);
  {
    var u = (c) => {
      var f = Gw();
      f.__click = [Fw, r];
      var h = sr(f);
      zn(() => {
        Mr(f, "title", r.subAction.label), ai(h, r.subAction.label);
      }), Qe(c, f);
    };
    Mn(s, (c) => {
      r.subAction && c(u);
    });
  }
  Qe(n, e), xi();
}
fl(["click"]);
var Uw = /* @__PURE__ */ dn("<!> <!>", 1);
function zw(n, r) {
  Ei(r, !0);
  const e = al("gm"), s = r.control.type, u = r.control.targetMode;
  let c = Dg(null);
  s && u && ut(c, kn(e.actionInstances[`${s}__${u}`] || null));
  var f = mi(), h = lr(f);
  {
    var m = (d) => {
      var y = Uw(), _ = lr(y);
      ys(_, 17, () => Ae(c).options, vs, (S, I) => {
        Dw(S, {
          get actionInstance() {
            return Ae(c);
          },
          get actionOption() {
            return Ae(I);
          }
        });
      });
      var E = ka(_, 2);
      ys(E, 17, () => Ae(c).actions, vs, (S, I) => {
        Bw(S, {
          get actionInstance() {
            return Ae(c);
          },
          get subAction() {
            return Ae(I);
          }
        });
      }), Qe(d, y);
    };
    Mn(h, (d) => {
      Ae(c) && d(m);
    });
  }
  Qe(n, f), xi();
}
/*! @license DOMPurify 3.2.4 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.2.4/LICENSE */
const {
  entries: ud,
  setPrototypeOf: kh,
  isFrozen: qw,
  getPrototypeOf: Yw,
  getOwnPropertyDescriptor: Hw
} = Object;
let {
  freeze: _t,
  seal: $t,
  create: ld
} = Object, {
  apply: mu,
  construct: vu
} = typeof Reflect < "u" && Reflect;
_t || (_t = function(r) {
  return r;
});
$t || ($t = function(r) {
  return r;
});
mu || (mu = function(r, e, s) {
  return r.apply(e, s);
});
vu || (vu = function(r, e) {
  return new r(...e);
});
const Hs = Et(Array.prototype.forEach), Jw = Et(Array.prototype.lastIndexOf), Sh = Et(Array.prototype.pop), qi = Et(Array.prototype.push), Vw = Et(Array.prototype.splice), aa = Et(String.prototype.toLowerCase), Co = Et(String.prototype.toString), Mh = Et(String.prototype.match), Yi = Et(String.prototype.replace), Xw = Et(String.prototype.indexOf), Ww = Et(String.prototype.trim), sn = Et(Object.prototype.hasOwnProperty), pt = Et(RegExp.prototype.test), Hi = Zw(TypeError);
function Et(n) {
  return function(r) {
    for (var e = arguments.length, s = new Array(e > 1 ? e - 1 : 0), u = 1; u < e; u++)
      s[u - 1] = arguments[u];
    return mu(n, r, s);
  };
}
function Zw(n) {
  return function() {
    for (var r = arguments.length, e = new Array(r), s = 0; s < r; s++)
      e[s] = arguments[s];
    return vu(n, e);
  };
}
function Me(n, r) {
  let e = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : aa;
  kh && kh(n, null);
  let s = r.length;
  for (; s--; ) {
    let u = r[s];
    if (typeof u == "string") {
      const c = e(u);
      c !== u && (qw(r) || (r[s] = c), u = c);
    }
    n[u] = !0;
  }
  return n;
}
function jw(n) {
  for (let r = 0; r < n.length; r++)
    sn(n, r) || (n[r] = null);
  return n;
}
function Sr(n) {
  const r = ld(null);
  for (const [e, s] of ud(n))
    sn(n, e) && (Array.isArray(s) ? r[e] = jw(s) : s && typeof s == "object" && s.constructor === Object ? r[e] = Sr(s) : r[e] = s);
  return r;
}
function Ji(n, r) {
  for (; n !== null; ) {
    const s = Hw(n, r);
    if (s) {
      if (s.get)
        return Et(s.get);
      if (typeof s.value == "function")
        return Et(s.value);
    }
    n = Yw(n);
  }
  function e() {
    return null;
  }
  return e;
}
const Ih = _t(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "section", "select", "shadow", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]), Ao = _t(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]), No = _t(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]), $w = _t(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]), Oo = _t(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]), Kw = _t(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]), bh = _t(["#text"]), Th = _t(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "pattern", "placeholder", "playsinline", "popover", "popovertarget", "popovertargetaction", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "wrap", "xmlns", "slot"]), Po = _t(["accent-height", "accumulate", "additive", "alignment-baseline", "amplitude", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dur", "edgemode", "elevation", "end", "exponent", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "intercept", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "slope", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "tablevalues", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]), Lh = _t(["accent", "accentunder", "align", "bevelled", "close", "columnsalign", "columnlines", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lspace", "lquote", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]), Js = _t(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]), Qw = $t(/\{\{[\w\W]*|[\w\W]*\}\}/gm), e2 = $t(/<%[\w\W]*|[\w\W]*%>/gm), t2 = $t(/\$\{[\w\W]*/gm), n2 = $t(/^data-[\-\w.\u00B7-\uFFFF]+$/), r2 = $t(/^aria-[\-\w]+$/), cd = $t(
  /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  // eslint-disable-line no-useless-escape
), i2 = $t(/^(?:\w+script|data):/i), s2 = $t(
  /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g
  // eslint-disable-line no-control-regex
), hd = $t(/^html$/i), a2 = $t(/^[a-z][.\w]*(-[.\w]+)+$/i);
var Ch = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  ARIA_ATTR: r2,
  ATTR_WHITESPACE: s2,
  CUSTOM_ELEMENT: a2,
  DATA_ATTR: n2,
  DOCTYPE_NAME: hd,
  ERB_EXPR: e2,
  IS_ALLOWED_URI: cd,
  IS_SCRIPT_OR_DATA: i2,
  MUSTACHE_EXPR: Qw,
  TMPLIT_EXPR: t2
});
const Vi = {
  element: 1,
  text: 3,
  // Deprecated
  progressingInstruction: 7,
  comment: 8,
  document: 9
}, o2 = function() {
  return typeof window > "u" ? null : window;
}, u2 = function(r, e) {
  if (typeof r != "object" || typeof r.createPolicy != "function")
    return null;
  let s = null;
  const u = "data-tt-policy-suffix";
  e && e.hasAttribute(u) && (s = e.getAttribute(u));
  const c = "dompurify" + (s ? "#" + s : "");
  try {
    return r.createPolicy(c, {
      createHTML(f) {
        return f;
      },
      createScriptURL(f) {
        return f;
      }
    });
  } catch {
    return console.warn("TrustedTypes policy " + c + " could not be created."), null;
  }
}, Ah = function() {
  return {
    afterSanitizeAttributes: [],
    afterSanitizeElements: [],
    afterSanitizeShadowDOM: [],
    beforeSanitizeAttributes: [],
    beforeSanitizeElements: [],
    beforeSanitizeShadowDOM: [],
    uponSanitizeAttribute: [],
    uponSanitizeElement: [],
    uponSanitizeShadowNode: []
  };
};
function fd() {
  let n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : o2();
  const r = (ge) => fd(ge);
  if (r.version = "3.2.4", r.removed = [], !n || !n.document || n.document.nodeType !== Vi.document || !n.Element)
    return r.isSupported = !1, r;
  let {
    document: e
  } = n;
  const s = e, u = s.currentScript, {
    DocumentFragment: c,
    HTMLTemplateElement: f,
    Node: h,
    Element: m,
    NodeFilter: d,
    NamedNodeMap: y = n.NamedNodeMap || n.MozNamedAttrMap,
    HTMLFormElement: _,
    DOMParser: E,
    trustedTypes: S
  } = n, I = m.prototype, D = Ji(I, "cloneNode"), q = Ji(I, "remove"), G = Ji(I, "nextSibling"), M = Ji(I, "childNodes"), H = Ji(I, "parentNode");
  if (typeof f == "function") {
    const ge = e.createElement("template");
    ge.content && ge.content.ownerDocument && (e = ge.content.ownerDocument);
  }
  let V, X = "";
  const {
    implementation: j,
    createNodeIterator: $,
    createDocumentFragment: x,
    getElementsByTagName: k
  } = e, {
    importNode: T
  } = s;
  let L = Ah();
  r.isSupported = typeof ud == "function" && typeof H == "function" && j && j.createHTMLDocument !== void 0;
  const {
    MUSTACHE_EXPR: A,
    ERB_EXPR: F,
    TMPLIT_EXPR: O,
    DATA_ATTR: N,
    ARIA_ATTR: P,
    IS_SCRIPT_OR_DATA: Y,
    ATTR_WHITESPACE: U,
    CUSTOM_ELEMENT: Z
  } = Ch;
  let {
    IS_ALLOWED_URI: K
  } = Ch, re = null;
  const de = Me({}, [...Ih, ...Ao, ...No, ...Oo, ...bh]);
  let ce = null;
  const se = Me({}, [...Th, ...Po, ...Lh, ...Js]);
  let ue = Object.seal(ld(null, {
    tagNameCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    attributeNameCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    allowCustomizedBuiltInElements: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: !1
    }
  })), xe = null, Le = null, J = !0, Kt = !0, be = !1, he = !0, C = !1, Pe = !0, Oe = !1, Se = !1, Rr = !1, pn = !1, Dr = !1, ne = !1, Ii = !0, bi = !1;
  const Nn = "user-content-";
  let Ti = !0, Ee = !1, Dt = {}, Qt = null;
  const Fr = Me({}, ["annotation-xml", "audio", "colgroup", "desc", "foreignobject", "head", "iframe", "math", "mi", "mn", "mo", "ms", "mtext", "noembed", "noframes", "noscript", "plaintext", "script", "style", "svg", "template", "thead", "title", "video", "xmp"]);
  let ye = null;
  const Gr = Me({}, ["audio", "video", "img", "source", "image", "track"]);
  let ke = null;
  const _e = Me({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]), Br = "http://www.w3.org/1998/Math/MathML", xt = "http://www.w3.org/2000/svg", en = "http://www.w3.org/1999/xhtml";
  let me = en, Li = !1, Ci = null;
  const Ai = Me({}, [Br, xt, en], Co);
  let at = Me({}, ["mi", "mo", "mn", "ms", "mtext"]), mn = Me({}, ["annotation-xml"]);
  const Ft = Me({}, ["title", "style", "font", "a", "script"]);
  let $n = null;
  const Ur = ["application/xhtml+xml", "text/html"], no = "text/html";
  let Ze = null, wt = null;
  const ie = e.createElement("form"), mr = function(B) {
    return B instanceof RegExp || B instanceof Function;
  }, Kn = function() {
    let B = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (!(wt && wt === B)) {
      if ((!B || typeof B != "object") && (B = {}), B = Sr(B), $n = // eslint-disable-next-line unicorn/prefer-includes
      Ur.indexOf(B.PARSER_MEDIA_TYPE) === -1 ? no : B.PARSER_MEDIA_TYPE, Ze = $n === "application/xhtml+xml" ? Co : aa, re = sn(B, "ALLOWED_TAGS") ? Me({}, B.ALLOWED_TAGS, Ze) : de, ce = sn(B, "ALLOWED_ATTR") ? Me({}, B.ALLOWED_ATTR, Ze) : se, Ci = sn(B, "ALLOWED_NAMESPACES") ? Me({}, B.ALLOWED_NAMESPACES, Co) : Ai, ke = sn(B, "ADD_URI_SAFE_ATTR") ? Me(Sr(_e), B.ADD_URI_SAFE_ATTR, Ze) : _e, ye = sn(B, "ADD_DATA_URI_TAGS") ? Me(Sr(Gr), B.ADD_DATA_URI_TAGS, Ze) : Gr, Qt = sn(B, "FORBID_CONTENTS") ? Me({}, B.FORBID_CONTENTS, Ze) : Fr, xe = sn(B, "FORBID_TAGS") ? Me({}, B.FORBID_TAGS, Ze) : {}, Le = sn(B, "FORBID_ATTR") ? Me({}, B.FORBID_ATTR, Ze) : {}, Dt = sn(B, "USE_PROFILES") ? B.USE_PROFILES : !1, J = B.ALLOW_ARIA_ATTR !== !1, Kt = B.ALLOW_DATA_ATTR !== !1, be = B.ALLOW_UNKNOWN_PROTOCOLS || !1, he = B.ALLOW_SELF_CLOSE_IN_ATTR !== !1, C = B.SAFE_FOR_TEMPLATES || !1, Pe = B.SAFE_FOR_XML !== !1, Oe = B.WHOLE_DOCUMENT || !1, pn = B.RETURN_DOM || !1, Dr = B.RETURN_DOM_FRAGMENT || !1, ne = B.RETURN_TRUSTED_TYPE || !1, Rr = B.FORCE_BODY || !1, Ii = B.SANITIZE_DOM !== !1, bi = B.SANITIZE_NAMED_PROPS || !1, Ti = B.KEEP_CONTENT !== !1, Ee = B.IN_PLACE || !1, K = B.ALLOWED_URI_REGEXP || cd, me = B.NAMESPACE || en, at = B.MATHML_TEXT_INTEGRATION_POINTS || at, mn = B.HTML_INTEGRATION_POINTS || mn, ue = B.CUSTOM_ELEMENT_HANDLING || {}, B.CUSTOM_ELEMENT_HANDLING && mr(B.CUSTOM_ELEMENT_HANDLING.tagNameCheck) && (ue.tagNameCheck = B.CUSTOM_ELEMENT_HANDLING.tagNameCheck), B.CUSTOM_ELEMENT_HANDLING && mr(B.CUSTOM_ELEMENT_HANDLING.attributeNameCheck) && (ue.attributeNameCheck = B.CUSTOM_ELEMENT_HANDLING.attributeNameCheck), B.CUSTOM_ELEMENT_HANDLING && typeof B.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements == "boolean" && (ue.allowCustomizedBuiltInElements = B.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements), C && (Kt = !1), Dr && (pn = !0), Dt && (re = Me({}, bh), ce = [], Dt.html === !0 && (Me(re, Ih), Me(ce, Th)), Dt.svg === !0 && (Me(re, Ao), Me(ce, Po), Me(ce, Js)), Dt.svgFilters === !0 && (Me(re, No), Me(ce, Po), Me(ce, Js)), Dt.mathMl === !0 && (Me(re, Oo), Me(ce, Lh), Me(ce, Js))), B.ADD_TAGS && (re === de && (re = Sr(re)), Me(re, B.ADD_TAGS, Ze)), B.ADD_ATTR && (ce === se && (ce = Sr(ce)), Me(ce, B.ADD_ATTR, Ze)), B.ADD_URI_SAFE_ATTR && Me(ke, B.ADD_URI_SAFE_ATTR, Ze), B.FORBID_CONTENTS && (Qt === Fr && (Qt = Sr(Qt)), Me(Qt, B.FORBID_CONTENTS, Ze)), Ti && (re["#text"] = !0), Oe && Me(re, ["html", "head", "body"]), re.table && (Me(re, ["tbody"]), delete xe.tbody), B.TRUSTED_TYPES_POLICY) {
        if (typeof B.TRUSTED_TYPES_POLICY.createHTML != "function")
          throw Hi('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
        if (typeof B.TRUSTED_TYPES_POLICY.createScriptURL != "function")
          throw Hi('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
        V = B.TRUSTED_TYPES_POLICY, X = V.createHTML("");
      } else
        V === void 0 && (V = u2(S, u)), V !== null && typeof X == "string" && (X = V.createHTML(""));
      _t && _t(B), wt = B;
    }
  }, Qn = Me({}, [...Ao, ...No, ...$w]), Ni = Me({}, [...Oo, ...Kw]), Oi = function(B) {
    let te = H(B);
    (!te || !te.tagName) && (te = {
      namespaceURI: me,
      tagName: "template"
    });
    const oe = aa(B.tagName), Be = aa(te.tagName);
    return Ci[B.namespaceURI] ? B.namespaceURI === xt ? te.namespaceURI === en ? oe === "svg" : te.namespaceURI === Br ? oe === "svg" && (Be === "annotation-xml" || at[Be]) : !!Qn[oe] : B.namespaceURI === Br ? te.namespaceURI === en ? oe === "math" : te.namespaceURI === xt ? oe === "math" && mn[Be] : !!Ni[oe] : B.namespaceURI === en ? te.namespaceURI === xt && !mn[Be] || te.namespaceURI === Br && !at[Be] ? !1 : !Ni[oe] && (Ft[oe] || !Qn[oe]) : !!($n === "application/xhtml+xml" && Ci[B.namespaceURI]) : !1;
  }, Tt = function(B) {
    qi(r.removed, {
      element: B
    });
    try {
      H(B).removeChild(B);
    } catch {
      q(B);
    }
  }, Gt = function(B, te) {
    try {
      qi(r.removed, {
        attribute: te.getAttributeNode(B),
        from: te
      });
    } catch {
      qi(r.removed, {
        attribute: null,
        from: te
      });
    }
    if (te.removeAttribute(B), B === "is")
      if (pn || Dr)
        try {
          Tt(te);
        } catch {
        }
      else
        try {
          te.setAttribute(B, "");
        } catch {
        }
  }, Pi = function(B) {
    let te = null, oe = null;
    if (Rr)
      B = "<remove></remove>" + B;
    else {
      const We = Mh(B, /^[\r\n\t ]+/);
      oe = We && We[0];
    }
    $n === "application/xhtml+xml" && me === en && (B = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + B + "</body></html>");
    const Be = V ? V.createHTML(B) : B;
    if (me === en)
      try {
        te = new E().parseFromString(Be, $n);
      } catch {
      }
    if (!te || !te.documentElement) {
      te = j.createDocument(me, "template", null);
      try {
        te.documentElement.innerHTML = Li ? X : Be;
      } catch {
      }
    }
    const et = te.body || te.documentElement;
    return B && oe && et.insertBefore(e.createTextNode(oe), et.childNodes[0] || null), me === en ? k.call(te, Oe ? "html" : "body")[0] : Oe ? te.documentElement : et;
  }, vr = function(B) {
    return $.call(
      B.ownerDocument || B,
      B,
      // eslint-disable-next-line no-bitwise
      d.SHOW_ELEMENT | d.SHOW_COMMENT | d.SHOW_TEXT | d.SHOW_PROCESSING_INSTRUCTION | d.SHOW_CDATA_SECTION,
      null
    );
  }, Ri = function(B) {
    return B instanceof _ && (typeof B.nodeName != "string" || typeof B.textContent != "string" || typeof B.removeChild != "function" || !(B.attributes instanceof y) || typeof B.removeAttribute != "function" || typeof B.setAttribute != "function" || typeof B.namespaceURI != "string" || typeof B.insertBefore != "function" || typeof B.hasChildNodes != "function");
  }, Di = function(B) {
    return typeof h == "function" && B instanceof h;
  };
  function tn(ge, B, te) {
    Hs(ge, (oe) => {
      oe.call(r, B, te, wt);
    });
  }
  const lt = function(B) {
    let te = null;
    if (tn(L.beforeSanitizeElements, B, null), Ri(B))
      return Tt(B), !0;
    const oe = Ze(B.nodeName);
    if (tn(L.uponSanitizeElement, B, {
      tagName: oe,
      allowedTags: re
    }), B.hasChildNodes() && !Di(B.firstElementChild) && pt(/<[/\w]/g, B.innerHTML) && pt(/<[/\w]/g, B.textContent) || B.nodeType === Vi.progressingInstruction || Pe && B.nodeType === Vi.comment && pt(/<[/\w]/g, B.data))
      return Tt(B), !0;
    if (!re[oe] || xe[oe]) {
      if (!xe[oe] && er(oe) && (ue.tagNameCheck instanceof RegExp && pt(ue.tagNameCheck, oe) || ue.tagNameCheck instanceof Function && ue.tagNameCheck(oe)))
        return !1;
      if (Ti && !Qt[oe]) {
        const Be = H(B) || B.parentNode, et = M(B) || B.childNodes;
        if (et && Be) {
          const We = et.length;
          for (let je = We - 1; je >= 0; --je) {
            const kt = D(et[je], !0);
            kt.__removalCount = (B.__removalCount || 0) + 1, Be.insertBefore(kt, G(B));
          }
        }
      }
      return Tt(B), !0;
    }
    return B instanceof m && !Oi(B) || (oe === "noscript" || oe === "noembed" || oe === "noframes") && pt(/<\/no(script|embed|frames)/i, B.innerHTML) ? (Tt(B), !0) : (C && B.nodeType === Vi.text && (te = B.textContent, Hs([A, F, O], (Be) => {
      te = Yi(te, Be, " ");
    }), B.textContent !== te && (qi(r.removed, {
      element: B.cloneNode()
    }), B.textContent = te)), tn(L.afterSanitizeElements, B, null), !1);
  }, zr = function(B, te, oe) {
    if (Ii && (te === "id" || te === "name") && (oe in e || oe in ie))
      return !1;
    if (!(Kt && !Le[te] && pt(N, te))) {
      if (!(J && pt(P, te))) {
        if (!ce[te] || Le[te]) {
          if (
            // First condition does a very basic check if a) it's basically a valid custom element tagname AND
            // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
            // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
            !(er(B) && (ue.tagNameCheck instanceof RegExp && pt(ue.tagNameCheck, B) || ue.tagNameCheck instanceof Function && ue.tagNameCheck(B)) && (ue.attributeNameCheck instanceof RegExp && pt(ue.attributeNameCheck, te) || ue.attributeNameCheck instanceof Function && ue.attributeNameCheck(te)) || // Alternative, second condition checks if it's an `is`-attribute, AND
            // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
            te === "is" && ue.allowCustomizedBuiltInElements && (ue.tagNameCheck instanceof RegExp && pt(ue.tagNameCheck, oe) || ue.tagNameCheck instanceof Function && ue.tagNameCheck(oe)))
          ) return !1;
        } else if (!ke[te]) {
          if (!pt(K, Yi(oe, U, ""))) {
            if (!((te === "src" || te === "xlink:href" || te === "href") && B !== "script" && Xw(oe, "data:") === 0 && ye[B])) {
              if (!(be && !pt(Y, Yi(oe, U, "")))) {
                if (oe)
                  return !1;
              }
            }
          }
        }
      }
    }
    return !0;
  }, er = function(B) {
    return B !== "annotation-xml" && Mh(B, Z);
  }, vn = function(B) {
    tn(L.beforeSanitizeAttributes, B, null);
    const {
      attributes: te
    } = B;
    if (!te || Ri(B))
      return;
    const oe = {
      attrName: "",
      attrValue: "",
      keepAttr: !0,
      allowedAttributes: ce,
      forceKeepAttr: void 0
    };
    let Be = te.length;
    for (; Be--; ) {
      const et = te[Be], {
        name: We,
        namespaceURI: je,
        value: kt
      } = et, Pn = Ze(We);
      let tt = We === "value" ? kt : Ww(kt);
      if (oe.attrName = Pn, oe.attrValue = tt, oe.keepAttr = !0, oe.forceKeepAttr = void 0, tn(L.uponSanitizeAttribute, B, oe), tt = oe.attrValue, bi && (Pn === "id" || Pn === "name") && (Gt(We, B), tt = Nn + tt), Pe && pt(/((--!?|])>)|<\/(style|title)/i, tt)) {
        Gt(We, B);
        continue;
      }
      if (oe.forceKeepAttr || (Gt(We, B), !oe.keepAttr))
        continue;
      if (!he && pt(/\/>/i, tt)) {
        Gt(We, B);
        continue;
      }
      C && Hs([A, F, O], (St) => {
        tt = Yi(tt, St, " ");
      });
      const Ts = Ze(B.nodeName);
      if (zr(Ts, Pn, tt)) {
        if (V && typeof S == "object" && typeof S.getAttributeType == "function" && !je)
          switch (S.getAttributeType(Ts, Pn)) {
            case "TrustedHTML": {
              tt = V.createHTML(tt);
              break;
            }
            case "TrustedScriptURL": {
              tt = V.createScriptURL(tt);
              break;
            }
          }
        try {
          je ? B.setAttributeNS(je, We, tt) : B.setAttribute(We, tt), Ri(B) ? Tt(B) : Sh(r.removed);
        } catch {
        }
      }
    }
    tn(L.afterSanitizeAttributes, B, null);
  }, On = function ge(B) {
    let te = null;
    const oe = vr(B);
    for (tn(L.beforeSanitizeShadowDOM, B, null); te = oe.nextNode(); )
      tn(L.uponSanitizeShadowNode, te, null), lt(te), vn(te), te.content instanceof c && ge(te.content);
    tn(L.afterSanitizeShadowDOM, B, null);
  };
  return r.sanitize = function(ge) {
    let B = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, te = null, oe = null, Be = null, et = null;
    if (Li = !ge, Li && (ge = "<!-->"), typeof ge != "string" && !Di(ge))
      if (typeof ge.toString == "function") {
        if (ge = ge.toString(), typeof ge != "string")
          throw Hi("dirty is not a string, aborting");
      } else
        throw Hi("toString is not a function");
    if (!r.isSupported)
      return ge;
    if (Se || Kn(B), r.removed = [], typeof ge == "string" && (Ee = !1), Ee) {
      if (ge.nodeName) {
        const kt = Ze(ge.nodeName);
        if (!re[kt] || xe[kt])
          throw Hi("root node is forbidden and cannot be sanitized in-place");
      }
    } else if (ge instanceof h)
      te = Pi("<!---->"), oe = te.ownerDocument.importNode(ge, !0), oe.nodeType === Vi.element && oe.nodeName === "BODY" || oe.nodeName === "HTML" ? te = oe : te.appendChild(oe);
    else {
      if (!pn && !C && !Oe && // eslint-disable-next-line unicorn/prefer-includes
      ge.indexOf("<") === -1)
        return V && ne ? V.createHTML(ge) : ge;
      if (te = Pi(ge), !te)
        return pn ? null : ne ? X : "";
    }
    te && Rr && Tt(te.firstChild);
    const We = vr(Ee ? ge : te);
    for (; Be = We.nextNode(); )
      lt(Be), vn(Be), Be.content instanceof c && On(Be.content);
    if (Ee)
      return ge;
    if (pn) {
      if (Dr)
        for (et = x.call(te.ownerDocument); te.firstChild; )
          et.appendChild(te.firstChild);
      else
        et = te;
      return (ce.shadowroot || ce.shadowrootmode) && (et = T.call(s, et, !0)), et;
    }
    let je = Oe ? te.outerHTML : te.innerHTML;
    return Oe && re["!doctype"] && te.ownerDocument && te.ownerDocument.doctype && te.ownerDocument.doctype.name && pt(hd, te.ownerDocument.doctype.name) && (je = "<!DOCTYPE " + te.ownerDocument.doctype.name + `>
` + je), C && Hs([A, F, O], (kt) => {
      je = Yi(je, kt, " ");
    }), V && ne ? V.createHTML(je) : je;
  }, r.setConfig = function() {
    let ge = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    Kn(ge), Se = !0;
  }, r.clearConfig = function() {
    wt = null, Se = !1;
  }, r.isValidAttribute = function(ge, B, te) {
    wt || Kn({});
    const oe = Ze(ge), Be = Ze(B);
    return zr(oe, Be, te);
  }, r.addHook = function(ge, B) {
    typeof B == "function" && qi(L[ge], B);
  }, r.removeHook = function(ge, B) {
    if (B !== void 0) {
      const te = Jw(L[ge], B);
      return te === -1 ? void 0 : Vw(L[ge], te, 1)[0];
    }
    return Sh(L[ge]);
  }, r.removeHooks = function(ge) {
    L[ge] = [];
  }, r.removeAllHooks = function() {
    L = Ah();
  }, r;
}
var l2 = fd();
const c2 = (n, r, e) => {
  r.control && r.controlOptions ? e.options.toggleMode(r.control.type, r.control.targetMode) : ae.error("Control or controlOptions not defined", r.control, r.controlOptions);
};
var h2 = /* @__PURE__ */ dn("<div><!></div>"), f2 = /* @__PURE__ */ dn('<div class="control-container svelte-1rd72r"><button type="button"><!></button> <!></div>');
function g2(n, r) {
  var m;
  Ei(r, !0);
  const e = (m = r.controlOptions) != null && m.icon ? l2.sanitize(r.controlOptions.icon.trim()) : null, s = al("gm"), u = s.control.getDefaultPosition();
  var c = mi(), f = lr(c);
  {
    var h = (d) => {
      var y = f2(), _ = sr(y);
      let E;
      _.__click = [c2, r, s];
      var S = sr(_);
      {
        var I = (M) => {
          var H = mi(), V = lr(H);
          pw(V, () => e), Qe(M, H);
        }, D = (M, H) => {
          {
            var V = (j) => {
              var $ = vh();
              zn((x) => ai($, x), [
                () => r.controlOptions.title.slice(0, 2)
              ]), Qe(j, $);
            }, X = (j) => {
              var $ = vh();
              zn(() => ai($, r.control.targetMode)), Qe(j, $);
            };
            Mn(
              M,
              (j) => {
                r.controlOptions.title ? j(V) : j(X, !1);
              },
              H
            );
          }
        };
        Mn(S, (M) => {
          r.controlOptions.icon ? M(I) : M(D, !1);
        });
      }
      var q = ka(_, 2);
      {
        var G = (M) => {
          var H = h2();
          let V;
          var X = sr(H);
          zw(X, {
            get control() {
              return r.control;
            }
          }), zn((j, $) => V = gu(H, 1, "control-menu svelte-1rd72r", null, V, { "menu-right": j, "menu-left": $ }), [
            () => u.endsWith("left"),
            () => u.endsWith("right")
          ]), Qe(M, H);
        };
        Mn(q, (M) => {
          r.controlOptions.active && M(G);
        });
      }
      zn(() => {
        Mr(_, "id", `id_${r.control.type}_${r.control.targetMode}`), E = gu(_, 1, `gm-control-button ${r.control.type}-${r.control.targetMode}`, "svelte-1rd72r", E, { active: r.controlOptions.active }), Mr(_, "title", r.controlOptions.title);
      }), Qe(d, y);
    };
    Mn(f, (d) => {
      r.control && r.controlOptions && r.controlOptions.uiEnabled && d(h);
    });
  }
  Qe(n, c), xi();
}
fl(["click"]);
var d2 = /* @__PURE__ */ dn("<div></div>"), p2 = /* @__PURE__ */ dn('<div class="gm-reactive-controls svelte-blwgmu"></div>');
function m2(n, r) {
  Ei(r, !1);
  const [e, s] = Sw(), u = () => kw(pu, "$controlsStore", e), f = `${al("gm").mapAdapter.mapType}gl`;
  let h = u(), m = h.controls, d = Rx(h.options);
  const y = pu.subscribe((S) => {
    m = S.controls, ut(d, S.options);
  });
  Mw(y);
  const _ = (S, I) => {
    const D = m == null ? void 0 : m[S];
    return (D == null ? void 0 : D[I]) || null;
  };
  ww();
  var E = p2();
  ys(E, 5, () => Object.entries(Ae(d)), vs, (S, I) => {
    let D = () => Ae(I)[0], q = () => Ae(I)[1];
    var G = d2();
    ys(G, 5, () => Object.entries(q()), vs, (M, H) => {
      let V = () => Ae(H)[0], X = () => Ae(H)[1];
      var j = mi();
      const $ = /* @__PURE__ */ Bg(() => _(D(), V()));
      var x = lr(j);
      {
        var k = (T) => {
          g2(T, {
            get control() {
              return Ae($);
            },
            get controlOptions() {
              return X();
            }
          });
        };
        Mn(x, (T) => {
          Ae($) && T(k);
        });
      }
      Qe(M, j);
    }), zn(() => gu(G, 1, `${f}-ctrl ${f}-ctrl-group group-${D()}`, "svelte-blwgmu")), Qe(S, G);
  }), Qe(n, E), xi(), s();
}
class v2 {
  constructor(r) {
    R(this, "gm");
    this.gm = r;
  }
}
class y2 extends v2 {
  constructor() {
    super(...arguments);
    R(this, "controls", hn(uf));
    R(this, "reactiveControls", null);
    R(this, "container");
    R(this, "mapEventHandlers", {
      [`${pe}:draw`]: this.handleModeEvent.bind(this),
      [`${pe}:edit`]: this.handleModeEvent.bind(this),
      [`${pe}:helper`]: this.handleModeEvent.bind(this)
    });
  }
  onAdd() {
    if (this.createControls(), this.gm.events.bus.attachEvents(this.mapEventHandlers), !this.container)
      throw new Error("Controls container is not initialized");
    return this.container;
  }
  createControls(e = void 0) {
    if (this.controlsAdded()) {
      ae.warn("Can't add controls: controls already added");
      return;
    }
    this.container = e || this.createHtmlContainer(), this.createReactivePanel();
  }
  onRemove() {
    this.gm.events.bus.detachEvents(this.mapEventHandlers), this.reactiveControls && (cw(this.reactiveControls), this.reactiveControls = null), this.container && this.container.parentNode && this.container.parentNode.removeChild(this.container), this.container = void 0;
  }
  handleModeEvent(e) {
    return Xu(e) ? (["mode_started", "mode_ended"].includes(e.action) && this.updateReactivePanel(), { next: !0 }) : { next: !0 };
  }
  controlsAdded() {
    return !!this.reactiveControls;
  }
  createReactivePanel() {
    if (!this.container) {
      ae.error("Can't create reactive panel: container is not initialized");
      return;
    }
    this.syncModeStates();
    const e = /* @__PURE__ */ new Map();
    e.set("gm", this.gm), this.reactiveControls = uw(
      m2,
      {
        target: this.container,
        context: e
      }
    ), this.updateReactivePanel();
  }
  updateReactivePanel() {
    pu.update(() => ({
      controls: this.controls,
      options: this.gm.options.controls
    }));
  }
  createHtmlContainer() {
    const e = document.createElement("div");
    return e.classList.add("geoman-controls"), e;
  }
  syncModeStates() {
    this.eachControlWithOptions(({ control: e }) => {
      this.gm.options.syncModeState(e.type, e.targetMode);
    });
  }
  eachControlWithOptions(e) {
    return ft(this.controls).forEach((s) => {
      const u = this.controls[s];
      return Object.keys(u).forEach((c) => {
        const f = c, h = this.getControl({ actionType: s, modeName: f }), m = this.gm.options.getControlOptions({ actionType: s, modeName: f });
        h && m && e({ control: h, controlOptions: m });
      });
    });
  }
  getControl({ actionType: e, modeName: s }) {
    return e && s && this.controls[e][s] || null;
  }
  getDefaultPosition() {
    return this.gm.options.settings.controlsPosition;
  }
}
const _2 = `_${pe}`;
class E2 {
  constructor(r) {
    R(this, "gm");
    R(this, "globalEventsListener", null);
    this.gm = r;
  }
  get map() {
    return this.gm.mapAdapter.getMapInstance();
  }
  processEvent(r, e) {
    this.fireToMap(
      "system",
      r.split(":")[1],
      { ...e, level: "user" }
    ), e.action === "mode_start" || e.action === "mode_end" ? this.forwardModeToggledEvent(e) : e.action === "feature_created" ? this.forwardFeatureCreated(e) : e.action === "feature_removed" ? this.forwardFeatureRemoved(e) : e.action === "feature_updated" ? this.forwardFeatureUpdated(e) : e.action === "feature_edit_start" ? this.forwardFeatureEditStart(e) : e.action === "feature_edit_end" ? this.forwardFeatureEditEnd(e) : (e.action === "loaded" || e.action === "unloaded") && this.forwardGeomanLoaded(e);
  }
  forwardModeToggledEvent(r) {
    const e = r.action === "mode_start";
    let s;
    if (r.type === "draw") {
      const u = "globaldrawmodetoggled";
      s = { enabled: e, shape: r.mode, map: this.map }, this.fireToMap("converted", u, s), s = { shape: r.mode, map: this.map }, this.fireToMap("converted", e ? "drawstart" : "drawend", s);
    } else if (r.type === "edit") {
      const u = this.getConvertedEditModeName(r.mode);
      s = { enabled: e, map: this.map }, this.fireToMap("converted", `global${u}modetoggled`, s);
    } else r.type === "helper" && (s = { enabled: e, map: this.map }, this.fireToMap("converted", `global${r.mode}modetoggled`, s));
  }
  forwardFeatureCreated(r) {
    const e = {
      shape: r.mode,
      feature: r.featureData,
      map: this.map
    };
    this.fireToMap("converted", "create", e);
  }
  forwardFeatureRemoved(r) {
    const e = {
      shape: r.mode,
      feature: r.featureData,
      map: this.map
    };
    this.fireToMap("converted", "remove", e);
  }
  forwardFeatureUpdated(r) {
    const e = ["lasso"], s = {
      map: this.map
    };
    r.sourceFeatures.length === 1 && !e.includes(r.mode) ? s.originalFeature = r.sourceFeatures[0] : s.originalFeatures = r.sourceFeatures, r.targetFeatures.length === 1 && !e.includes(r.mode) ? (s.feature = r.targetFeatures[0], s.shape = s.feature.shape) : s.features = r.targetFeatures;
    const u = this.getConvertedEditModeName(r.mode);
    this.fireToMap("converted", `${u}`, s);
  }
  forwardFeatureEditStart(r) {
    const e = this.getConvertedEditModeName(r.mode), s = {
      shape: r.feature.shape,
      feature: r.feature,
      map: this.map
    };
    this.fireToMap("converted", `${e}start`, s);
  }
  forwardFeatureEditEnd(r) {
    const e = this.getConvertedEditModeName(r.mode), s = {
      shape: r.feature.shape,
      feature: r.feature,
      map: this.map
    };
    this.fireToMap("converted", `${e}end`, s);
  }
  forwardGeomanLoaded(r) {
    this.fireToMap(
      "converted",
      `${r.action}`,
      { map: this.map, [pe]: this.gm }
    );
  }
  fireToMap(r, e, s) {
    const c = `${r === "system" ? _2 : pe}:${e}`;
    this.globalEventsListener && this.globalEventsListener({ type: r, name: c, payload: s }), this.gm.mapAdapter.fire(c, s);
  }
  getConvertedEditModeName(r) {
    return r === "change" ? "edit" : r;
  }
}
class x2 {
  constructor(r) {
    R(this, "gm");
    R(this, "forwarder");
    R(this, "mapEventHandlers", {});
    R(this, "gmEventHandlers", {});
    this.gm = r, this.forwarder = new E2(r);
  }
  fireEvent(r, e) {
    const s = this.gmEventHandlers[r];
    if (!s)
      return;
    const { controlHandler: u } = s;
    u(e), this.forwarder.processEvent(r, e);
  }
  attachEvents(r) {
    ft(r).forEach((e) => {
      const s = r[e];
      s && this.on(e, s);
    });
  }
  detachEvents(r) {
    ft(r).forEach((e) => {
      const s = r[e];
      s && this.off(e, s);
    });
  }
  detachAllEvents() {
    ft(this.gmEventHandlers).forEach((r) => {
      var s;
      Array.from(((s = this.gmEventHandlers[r]) == null ? void 0 : s.handlers) || []).forEach((u) => {
        this.off(r, u);
      });
    }), ft(this.mapEventHandlers).forEach((r) => {
      var s;
      Array.from(((s = this.mapEventHandlers[r]) == null ? void 0 : s.handlers) || []).forEach((u) => {
        this.off(r, u);
      });
    });
  }
  on(r, e) {
    r.startsWith(pe) ? this.onGmEvent(r, e) : this.onMapEvent(r, e);
  }
  onGmEvent(r, e) {
    var s;
    this.gmEventHandlers[r] || (this.gmEventHandlers[r] = this.createEventSection(r)), (s = this.gmEventHandlers[r]) == null || s.handlers.unshift(e);
  }
  onMapEvent(r, e) {
    var s;
    if (!this.mapEventHandlers[r]) {
      const u = this.createEventSection(r);
      this.gm.mapAdapter.on(r, u.controlHandler), this.mapEventHandlers[r] = u;
    }
    (s = this.mapEventHandlers[r]) == null || s.handlers.unshift(e);
  }
  off(r, e) {
    r.startsWith(`${pe}`) ? this.offGmEvent(r, e) : this.offMapEvent(r, e);
  }
  offGmEvent(r, e) {
    var c;
    const s = ((c = this.gmEventHandlers[r]) == null ? void 0 : c.handlers) || [], u = s.findIndex(
      (f) => e === f
    );
    u === -1 ? ae.warn("MapEvents: handler not found", r, e) : (s.splice(u, 1), s.length === 0 && delete this.gmEventHandlers[r]);
  }
  offMapEvent(r, e) {
    var c, f;
    const s = ((c = this.mapEventHandlers[r]) == null ? void 0 : c.handlers) || [], u = s.findIndex(
      (h) => e === h
    );
    if (u === -1)
      ae.warn("MapEvents: handler not found", r, e);
    else if (s.splice(u, 1), s.length === 0) {
      const h = (f = this.mapEventHandlers[r]) == null ? void 0 : f.controlHandler;
      h && this.gm.mapAdapter.off(r, h), delete this.mapEventHandlers[r];
    }
  }
  createEventSection(r) {
    return {
      handlers: [],
      controlHandler: (e) => {
        let s;
        if (jt(e) && r.startsWith(`${pe}`) ? s = this.gmEventHandlers[r] : s = this.mapEventHandlers[r], !s) {
          ae.debug(`No handlers for eventName: "${r}"`);
          return;
        }
        s.handlers.some((u) => {
          let c;
          return jt(e), c = u(e), c && typeof c == "object" && "next" in c ? !c.next : (ae.error('EventsBus: handler should return an object with a "next" property'), !1);
        });
      }
    };
  }
}
class w2 extends Ha {
  constructor(e, s) {
    super(e);
    R(this, "mapEventHandlers", {
      [`${pe}:control`]: this.handleControlEvent.bind(this)
    });
    s.attachEvents(this.mapEventHandlers);
  }
  handleControlEvent(e) {
    return eg(e) ? (this.getControl(e) || ae.error("Control not found, event payload", e), { next: !0 }) : { next: !0 };
  }
}
const gd = [
  "drag",
  "change",
  "rotate",
  "scale",
  "copy",
  "cut",
  "split",
  "union",
  "difference",
  "line_simplification",
  "lasso",
  "delete"
];
class ki extends Wu {
  constructor() {
    super(...arguments);
    R(this, "actionType", "edit");
    R(this, "featureData", null);
    R(this, "cursorExcludedLayerIds", [
      "rectangle-line",
      "polygon-line",
      "circle-line"
    ]);
    R(this, "layerEventHandlersData", []);
  }
  startAction() {
    this.setEventsForLayers("mouseenter", this.setCursorToPointer.bind(this)), this.setEventsForLayers("mouseleave", this.setCursorToEmpty.bind(this)), super.startAction();
  }
  endAction() {
    this.clearEventsForLayers(), super.endAction();
  }
  setCursorToPointer() {
    this.gm.mapAdapter.setCursor("pointer");
  }
  setCursorToEmpty() {
    this.gm.mapAdapter.setCursor("");
  }
  setEventsForLayers(e, s) {
    this.gm.features.layers.map((c) => c.id).filter(
      (c) => !this.cursorExcludedLayerIds.some((f) => c.includes(f))
    ).forEach((c) => {
      this.gm.mapAdapter.on(e, c, s), this.layerEventHandlersData.push({ eventName: e, layerId: c, callback: s });
    });
  }
  clearEventsForLayers() {
    this.layerEventHandlersData.forEach(({ eventName: e, layerId: s, callback: u }) => {
      this.gm.mapAdapter.off(e, s, u);
    }), this.layerEventHandlersData = [];
  }
  updateFeatureGeoJson({ featureData: e, featureGeoJson: s, forceMode: u = void 0 }) {
    return this.flags.featureUpdateAllowed ? (e.shape === "circle" && s.properties.center && e.setShapeProperty("center", s.properties.center), e.updateGeoJsonGeometry(s.geometry), this.fireFeatureUpdatedEvent({
      sourceFeatures: [e],
      targetFeatures: [e],
      forceMode: u
    }), !0) : !1;
  }
  fireFeatureUpdatedEvent({ sourceFeatures: e, targetFeatures: s, markerData: u = void 0, forceMode: c = void 0 }) {
    const f = {
      level: "system",
      type: "edit",
      action: "feature_updated",
      mode: c || this.mode,
      sourceFeatures: e,
      targetFeatures: s,
      markerData: u || null
    };
    this.gm.events.fire(`${pe}:edit`, f);
  }
  fireFeatureEditStartEvent({ feature: e, forceMode: s = void 0 }) {
    const u = {
      level: "system",
      type: "edit",
      action: "feature_edit_start",
      mode: s || this.mode,
      feature: e
    };
    this.gm.events.fire(`${pe}:edit`, u);
  }
  fireFeatureEditEndEvent({ feature: e, forceMode: s = void 0 }) {
    const u = {
      level: "system",
      type: "edit",
      action: "feature_edit_end",
      mode: s || this.mode,
      feature: e
    };
    this.gm.events.fire(`${pe}:edit`, u);
  }
  fireMarkerPointerUpdateEvent() {
    if (!this.gm.markerPointer.marker)
      return;
    const e = this.gm.markerPointer.marker, s = {
      level: "system",
      variant: null,
      type: "draw",
      mode: this.getLineDrawerMode(),
      action: "update",
      markerData: {
        type: "dom",
        instance: e,
        position: {
          coordinate: e.getLngLat(),
          path: [-1]
        }
      },
      featureData: null
    };
    this.gm.events.fire(`${pe}:draw`, s);
  }
  forwardLineDrawerEvent(e) {
    if (!tg(e) || !["cut", "split"].includes(this.mode))
      return { next: !0 };
    if (e.action === "start" || e.action === "update") {
      const s = {
        level: "system",
        type: "draw",
        mode: this.getLineDrawerMode(),
        variant: null,
        action: e.action,
        featureData: e.featureData,
        markerData: e.markerData
      };
      this.gm.events.fire(`${pe}:draw`, s);
    } else if (e.action === "finish" || e.action === "cancel") {
      const s = {
        level: "system",
        type: "draw",
        mode: this.getLineDrawerMode(),
        variant: null,
        action: e.action
      };
      this.gm.events.fire(`${pe}:draw`, s);
    }
    return { next: !0 };
  }
  fireFeatureRemovedEvent(e) {
    if (Ir(e.shape, as)) {
      const s = {
        level: "system",
        type: "edit",
        mode: e.shape,
        action: "feature_removed",
        featureData: e
      };
      this.gm.events.fire(`${pe}:edit`, s);
    }
  }
  getLineDrawerMode() {
    return this.mode === "cut" ? "polygon" : (this.mode === "split", "line");
  }
}
const dd = [
  "shape_markers",
  "pin",
  "snapping",
  "snap_guides",
  "measurements",
  "auto_trace",
  "geofencing",
  "zoom_to_features",
  "click_to_edit"
];
class pr extends Wu {
  constructor() {
    super(...arguments);
    R(this, "actionType", "helper");
  }
}
const Si = (n) => jt(n) && n.type === "edit", k2 = (n) => W_.includes(n), S2 = (n) => ng.includes(n), M2 = (n) => gd.includes(n), I2 = (n) => dd.includes(n), b2 = (n) => S2(n) || M2(n) || I2(n);
class T2 extends Ha {
  constructor(e, s) {
    super(e);
    R(this, "mapEventHandlers", {
      [`${pe}:draw`]: this.handleDrawEvent.bind(this)
    });
    s.attachEvents(this.mapEventHandlers);
  }
  handleDrawEvent(e) {
    if (!Zu(e))
      return { next: !0 };
    const s = `${e.type}__${e.mode}`;
    return e.action === "mode_start" ? (this.trackExclusiveModes(e), this.start(s, e), this.trackRelatedModes(e)) : e.action === "mode_end" && (this.trackRelatedModes(e), this.end(s)), { next: !0 };
  }
  start(e, s) {
    const u = this.gm.createDrawInstance(s.mode);
    u && (e in this.gm.actionInstances && ae.error(`Action instance "${e}" already exists`), this.gm.actionInstances[e] = u, u.startAction());
  }
  end(e) {
    const s = this.gm.actionInstances[e];
    s instanceof Wn ? (s.endAction(), delete this.gm.actionInstances[e]) : console.error(
      `Wrong action instance for draw event "${e}":`,
      s
    );
  }
}
class L2 extends Ha {
  constructor(e, s) {
    super(e);
    R(this, "mapEventHandlers", {
      [`${pe}:edit`]: this.handleEditEvent.bind(this)
    });
    s.attachEvents(this.mapEventHandlers);
  }
  handleEditEvent(e) {
    if (!Si(e))
      return { next: !0 };
    const s = `${e.type}__${e.mode}`;
    return e.action === "mode_start" ? (this.trackExclusiveModes(e), this.start(s, e), this.trackRelatedModes(e)) : e.action === "mode_end" && (this.trackRelatedModes(e), this.end(s)), { next: !0 };
  }
  start(e, s) {
    if (s.action !== "mode_start")
      return;
    const u = this.gm.createEditInstance(s.mode);
    u && (e in this.gm.actionInstances && ae.error(`Action instance "${e}" already exists`), this.gm.actionInstances[e] = u, u.startAction());
  }
  end(e) {
    const s = this.gm.actionInstances[e];
    s instanceof ki ? (s.endAction(), delete this.gm.actionInstances[e]) : console.error(
      `Wrong action instance for edit event "${e}": `,
      s
    );
  }
}
class C2 extends Ha {
  constructor(e, s) {
    super(e);
    R(this, "mapEventHandlers", {
      [`${pe}:helper`]: this.handleHelperEvent.bind(this)
    });
    s.attachEvents(this.mapEventHandlers);
  }
  handleHelperEvent(e) {
    if (!Ja(e))
      return { next: !0 };
    const s = `${e.type}__${e.mode}`;
    return e.action === "mode_start" ? (this.trackExclusiveModes(e), this.start(s, e), this.trackRelatedModes(e)) : e.action === "mode_end" && (this.trackRelatedModes(e), this.end(s)), { next: !0 };
  }
  start(e, s) {
    const u = this.gm.createHelperInstance(s.mode);
    u && (e in this.gm.actionInstances && ae.error(`Action instance "${e}" already exists`), this.gm.actionInstances[e] = u, u.startAction());
  }
  end(e) {
    const s = this.gm.actionInstances[e];
    s instanceof pr ? (s.endAction(), delete this.gm.actionInstances[e]) : console.error(
      `Wrong action instance for edit event "${e}":`,
      s
    );
  }
}
class A2 {
  constructor(r) {
    R(this, "gm");
    R(this, "bus");
    R(this, "listeners", {});
    this.gm = r, this.bus = new x2(this.gm), this.listeners = {
      draw: new T2(this.gm, this.bus),
      edit: new L2(this.gm, this.bus),
      helper: new C2(this.gm, this.bus),
      control: new w2(this.gm, this.bus)
    };
  }
  fire(r, e) {
    this.listeners[e.type] || ae.error(`Can't find event listener for "${e.type}" event type`), this.bus.fireEvent(r, e);
  }
}
class N2 {
  getEuclideanNearestLngLat(r, e) {
    const s = this.project(e);
    let u = [0, 0], c = 1 / 0;
    return Hu(r, (f) => {
      const h = this.project(f.start.coordinate), m = this.project(f.end.coordinate), d = F_(
        h,
        m,
        s
      ), y = Ks(s, d);
      y < c && (c = y, u = [d[0], d[1]]);
    }), this.unproject(u);
  }
  getDistance(r, e) {
    return df(r, e, { units: "meters" });
  }
}
class O2 {
  isInstanceAvailable() {
    return this.layerInstance ? !0 : (ae.error("layerInstance is not available"), !1);
  }
}
class Ro extends O2 {
  constructor({ gm: e, layerId: s, options: u }) {
    super();
    R(this, "gm");
    R(this, "layerInstance", null);
    R(this, "mapInstance");
    this.gm = e, this.mapInstance = this.gm.mapAdapter.mapInstance, u ? this.layerInstance = this.createLayer(u) : this.layerInstance = this.mapInstance.getLayer(s) || null;
  }
  get id() {
    if (!this.isInstanceAvailable())
      throw new Error("Layer instance is not available");
    return this.layerInstance.id;
  }
  get source() {
    if (!this.isInstanceAvailable())
      throw new Error("Layer instance is not available");
    return this.layerInstance.source;
  }
  createLayer(e) {
    return this.mapInstance.addLayer(e), this.mapInstance.getLayer(e.id) || null;
  }
  remove() {
    this.isInstanceAvailable() && this.mapInstance.removeLayer(this.id), this.layerInstance = null;
  }
}
class P2 extends Su {
  constructor({ mapInstance: e, options: s, lngLat: u }) {
    super();
    R(this, "markerInstance");
    this.markerInstance = new ku.Marker(s).setLngLat(u).addTo(e);
  }
  getElement() {
    var e;
    return this.isMarkerInstanceAvailable() && ((e = this.markerInstance) == null ? void 0 : e.getElement()) || null;
  }
  setLngLat(e) {
    var s;
    this.isMarkerInstanceAvailable() && ((s = this.markerInstance) == null || s.setLngLat(e));
  }
  getLngLat() {
    var e;
    return this.isMarkerInstanceAvailable() ? ((e = this.markerInstance) == null ? void 0 : e.getLngLat().toArray()) || [0, 0] : [0, 0];
  }
  remove() {
    var e;
    (e = this.markerInstance) == null || e.remove();
  }
}
class R2 {
  isInstanceAvailable() {
    return this.popupInstance ? !0 : (ae.error("Popup instance is not available"), !1);
  }
}
class D2 extends R2 {
  constructor({ mapInstance: e, options: s, lngLat: u }) {
    super();
    R(this, "popupInstance");
    this.popupInstance = new ku.Popup(s).addTo(e), u && this.setLngLat(u);
  }
  getLngLat() {
    return this.isInstanceAvailable() ? this.popupInstance.getLngLat().toArray() || [0, 0] : [0, 0];
  }
  setLngLat(e) {
    this.isInstanceAvailable() && this.popupInstance.setLngLat(e);
  }
  setHtml(e) {
    this.isInstanceAvailable() && this.popupInstance.setHTML(e);
  }
  remove() {
    this.isInstanceAvailable() && this.popupInstance.remove();
  }
}
function F2(n, r) {
  const e = n ?? { add: [], update: [], remove: [] }, s = r ?? { add: [], update: [], remove: [] }, u = new Set(s.remove), c = e.add.filter((m) => !u.has(m.id)), f = e.update.filter((m) => !u.has(m.id)), h = [];
  return s.update.forEach((m) => {
    const d = c.findIndex((_) => _.id === m.id), y = f.findIndex((_) => _.id === m.id);
    if (d === -1 && y === -1) {
      h.push(m);
      return;
    }
    d !== -1 && (c[d] = m), y !== -1 && (f[y] = m);
  }), {
    add: [...c, ...s.add],
    update: [...f, ...h],
    remove: [...e.remove, ...s.remove]
  };
}
class Nh extends J_ {
  constructor({ gm: e, geoJson: s, sourceId: u }) {
    super();
    R(this, "gm");
    R(this, "mapInstance");
    R(this, "sourceInstance");
    R(this, "pendingUpdateStorage", null);
    R(this, "mlSourceDiff", null);
    R(this, "updateTimeout", null);
    R(this, "updateData", (e) => {
      if (!this.isInstanceAvailable())
        return;
      const s = F2(this.pendingUpdateStorage, e ?? null);
      if (this.updateTimeout && (window.clearTimeout(this.updateTimeout), this.updateTimeout = null), this.sourceInstance._pendingLoads === 0) {
        this.pendingUpdateStorage = null;
        const u = this.convertGeoJsonDiffToMlDiff(s);
        this.sourceInstance.updateData(u);
      } else
        this.pendingUpdateStorage = s, this.updateTimeout = window.setTimeout(this.updateData, 15);
    });
    this.gm = e, this.mapInstance = this.gm.mapAdapter.mapInstance, s ? this.sourceInstance = this.createSource({ geoJson: s, sourceId: u }) : this.sourceInstance = this.mapInstance.getSource(u) || null;
  }
  get id() {
    if (!this.isInstanceAvailable())
      throw new Error("Source instance is not available");
    return this.sourceInstance.id;
  }
  createSource({ geoJson: e, sourceId: s }) {
    let u = this.mapInstance.getSource(s);
    return u || (this.mapInstance.addSource(s, {
      type: "geojson",
      data: e,
      promoteId: br
    }), u = this.mapInstance.getSource(s)), u ?? null;
  }
  getGeoJson() {
    if (!this.isInstanceAvailable())
      throw new Error("Source instance is not available");
    return this.sourceInstance.serialize().data;
  }
  setGeoJson(e) {
    if (!this.isInstanceAvailable())
      throw new Error("Source instance is not available");
    return this.sourceInstance.setData(e);
  }
  convertGeoJsonDiffToMlDiff(e) {
    return {
      add: e.add,
      update: e.update.map(this.convertFeatureToMlUpdateDiff.bind(this)),
      remove: e.remove
    };
  }
  convertFeatureToMlUpdateDiff(e) {
    const s = Object.entries(e.properties || {}).map((u) => ({ key: u[0], value: u[1] }));
    return {
      id: e.id,
      newGeometry: e.geometry,
      addOrUpdateProperties: s
    };
  }
  remove({ removeLayers: e }) {
    this.isInstanceAvailable() && (e && this.gm.mapAdapter.eachLayer((s) => {
      s.source === this.sourceInstance.id && this.gm.mapAdapter.removeLayer(s.id);
    }), this.mapInstance.removeSource(this.sourceInstance.id));
  }
}
const G2 = [
  "click",
  "dblclick",
  "mousedown",
  "mouseup",
  "mousemove",
  "mouseenter",
  "mouseleave",
  "mouseover",
  "mouseout",
  "contextmenu",
  "touchstart",
  "touchend",
  "touchcancel"
], Do = (n) => G2.includes(n);
class B2 extends N2 {
  constructor(e, s) {
    super();
    R(this, "gm");
    R(this, "mapType", "maplibre");
    R(this, "mapInstance");
    this.gm = s, this.mapInstance = e;
  }
  getMapInstance() {
    return this.mapInstance;
  }
  isLoaded() {
    return this.mapInstance.loaded();
  }
  getContainer() {
    return this.mapInstance.getContainer();
  }
  getCanvas() {
    return this.mapInstance.getCanvas();
  }
  addControl(e) {
    this.mapInstance.addControl(e);
  }
  removeControl(e) {
    this.mapInstance.removeControl(e);
  }
  async loadImage({ id: e, image: s }) {
    const u = await this.mapInstance.loadImage(s);
    this.mapInstance.addImage(e, u.data);
  }
  getBounds() {
    return this.mapInstance.getBounds().toArray();
  }
  fitBounds(e, s) {
    this.mapInstance.fitBounds(e, s);
  }
  setCursor(e) {
    this.mapInstance.getCanvas().style.cursor = e;
  }
  disableMapInteractions(e) {
    e.forEach((s) => {
      this.mapInstance[s].disable();
    });
  }
  enableMapInteractions(e) {
    e.forEach((s) => {
      this.mapInstance[s].enable();
    });
  }
  setDragPan(e) {
    e ? this.mapInstance.dragPan.enable() : this.mapInstance.dragPan.disable();
  }
  queryFeaturesByScreenCoordinates({ queryCoordinates: e = void 0, sourceNames: s }) {
    return Pc(this.mapInstance.queryRenderedFeatures(e).map((c) => ({
      featureId: c.properties[br],
      featureSourceName: c.source
    })), qa).map(({ featureId: c, featureSourceName: f }) => c === void 0 || !s.includes(f) ? null : this.gm.features.get(f, c) || null).filter((c) => !!c);
  }
  queryGeoJsonFeatures({ queryCoordinates: e = void 0, sourceNames: s }) {
    const u = (f, h) => (f == null ? void 0 : f.id) === (h == null ? void 0 : h.id);
    return Pc(this.mapInstance.queryRenderedFeatures(e).map((f) => {
      const h = this.convertToGeoJsonImportFeature(f);
      return h ? {
        id: f.properties[br],
        sourceName: f.source,
        geoJson: h
      } : null;
    }), u).filter(
      (f) => !!f && f.id !== void 0 && f.geoJson && s.includes(f.sourceName)
    );
  }
  convertToGeoJsonImportFeature(e) {
    const s = e.properties[br];
    return s === void 0 || e.geometry.type === "GeometryCollection" ? null : {
      id: s,
      type: "Feature",
      properties: e.properties,
      geometry: e.geometry
    };
  }
  addSource(e, s) {
    return new Nh({ gm: this.gm, sourceId: e, geoJson: s });
  }
  getSource(e) {
    return new Nh({ gm: this.gm, sourceId: e });
  }
  addLayer(e) {
    const s = e.id;
    return new Ro({ gm: this.gm, layerId: s, options: e });
  }
  getLayer(e) {
    return new Ro({ gm: this.gm, layerId: e });
  }
  removeLayer(e) {
    const s = this.getLayer(e);
    s && s.remove();
  }
  eachLayer(e) {
    this.mapInstance.getStyle().layers.forEach((s) => {
      e(new Ro({ gm: this.gm, layerId: s.id }));
    });
  }
  createDomMarker(e, s) {
    return new P2({
      mapInstance: this.mapInstance,
      options: e,
      lngLat: s
    });
  }
  createPopup(e, s) {
    return new D2({
      mapInstance: this.mapInstance,
      options: e,
      lngLat: s
    });
  }
  project(e) {
    const s = this.mapInstance.project(e);
    return [s.x, s.y];
  }
  unproject(e) {
    const s = this.mapInstance.unproject(e);
    return [s.lng, s.lat];
  }
  coordBoundsToScreenBounds(e) {
    const s = new ku.LngLatBounds(e), u = this.project(s.getSouthWest().toArray()), c = this.project(s.getNorthEast().toArray());
    return [u, c];
  }
  fire(e, s) {
    this.mapInstance.fire(e, s);
  }
  on(e, s, u) {
    if (typeof s == "string" && u && Do(e))
      this.mapInstance.on(e, s, u);
    else if (typeof s == "function")
      this.mapInstance.on(e, s);
    else
      throw new Error("Invalid arguments passed to 'on' method");
  }
  once(e, s, u) {
    if (typeof s == "string" && u && Do(e))
      this.mapInstance.once(e, s, u);
    else if (typeof s == "function")
      this.mapInstance.once(e, s);
    else
      throw new Error("Invalid arguments passed to 'once' method.");
  }
  off(e, s, u) {
    if (typeof s == "string" && u && Do(e))
      this.mapInstance.off(e, s, u);
    else if (typeof s == "function")
      this.mapInstance.off(e, s);
    else
      throw new Error("Invalid arguments passed to 'off' method");
  }
}
const U2 = async (n, r) => new B2(r, n), z2 = (n, r) => {
  if (Array.isArray(n) && Array.isArray(r)) {
    const e = w_(n, "type");
    return r.forEach((s) => {
      e[s.type] ? k_(e[s.type], s) : e[s.type] = hn(s);
    }), v_(e);
  }
};
class q2 {
  constructor(r, e) {
    R(this, "gm");
    R(this, "settings");
    R(this, "controls");
    R(this, "layerStyles");
    this.gm = r;
    const s = this.getMergedOptions(e);
    this.settings = s.settings, this.controls = s.controls, this.layerStyles = s.layerStyles;
  }
  getMergedOptions(r = {}) {
    return g_(
      bg(),
      r,
      z2
    );
  }
  enableMode(r, e) {
    const s = this.isModeEnabled(r, e), u = this.isModeAvailable(r, e);
    if (u || ae.warn(`Unable to enable mode, "${r}:${e}" is not available`), s || !u)
      return;
    const f = this.controls[r][e];
    f ? (f.active = !0, this.fireModeEvent(r, e, "mode_start"), this.fireControlEvent(r, e, "on"), this.fireModeEvent(r, e, "mode_started")) : ae.error("Can't find control section for", r, e);
  }
  disableMode(r, e) {
    const s = this.isModeEnabled(r, e), u = this.isModeAvailable(r, e);
    if (!s || !u)
      return;
    const f = this.controls[r][e];
    f ? (f.active = !1, this.fireModeEvent(r, e, "mode_end"), this.fireControlEvent(r, e, "off"), this.fireModeEvent(r, e, "mode_ended")) : ae.error("Can't find control section for", r, e);
  }
  syncModeState(r, e) {
    const u = this.controls[r][e], c = this.isModeAvailable(r, e);
    u && (c ? u.active ? this.enableMode(r, e) : this.disableMode(r, e) : (console.log(`Not available mode: ${r}:${e}`), u.active = !1, u.uiEnabled = !1));
  }
  toggleMode(r, e) {
    this.isModeEnabled(r, e) ? this.disableMode(r, e) : this.enableMode(r, e);
  }
  isModeEnabled(r, e) {
    return !!Object.entries(this.gm.actionInstances).find(([s, u]) => s === `${r}__${e}` && u);
  }
  isModeAvailable(r, e) {
    return r === "draw" && Ir(e, ng) ? !!this.gm.drawClassMap[e] : r === "edit" && Ir(e, gd) ? !!this.gm.editClassMap[e] : r === "helper" && Ir(e, dd) ? !!this.gm.helperClassMap[e] : !1;
  }
  getControlOptions({ actionType: r, modeName: e }) {
    return r && e && this.controls[r][e] || null;
  }
  fireModeEvent(r, e, s) {
    const u = {
      level: "system",
      type: r,
      mode: e,
      action: s
    };
    Xu(u) && (Zu(u) ? this.gm.events.fire(`${pe}:${r}`, u) : Si(u) ? this.gm.events.fire(`${pe}:${r}`, u) : Ja(u) && this.gm.events.fire(`${pe}:${r}`, u));
  }
  fireControlEvent(r, e, s) {
    const u = {
      level: "system",
      type: "control",
      section: r,
      target: e,
      action: s
    };
    this.gm.events.fire(`${pe}:control`, u);
  }
}
class pd extends Wn {
  constructor() {
    super(...arguments);
    R(this, "mode", "circle");
    R(this, "shape", "circle");
    R(this, "circleCenterPoint", null);
    R(this, "circleCenterLngLat", null);
    R(this, "mapEventHandlers", {
      mousemove: this.onMouseMove.bind(this),
      click: this.onMouseClick.bind(this)
    });
  }
  onStartAction() {
    this.gm.markerPointer.enable();
  }
  onEndAction() {
    this.removeTmpFeature(), this.gm.markerPointer.disable(), this.fireFinishEvent();
  }
  createFeature() {
    const e = this.gm.features.createFeature({
      shapeGeoJson: this.getFeatureGeoJson(this.circleCenterLngLat || [0, 0]),
      sourceName: ee.temporary
    });
    return e && this.circleCenterLngLat && e.setShapeProperty("center", this.circleCenterLngLat), e;
  }
  getFeatureGeoJson(e) {
    return {
      type: "Feature",
      properties: {
        shape: this.shape
      },
      geometry: {
        type: "Point",
        coordinates: e
      }
    };
  }
  createMarker() {
    const e = document.createElement("div");
    e.innerHTML = lf;
    const s = e.firstChild;
    return s.style.color = "#278cda", s.style.width = "28px", s.style.height = "28px", s.style.pointerEvents = "none", this.gm.mapAdapter.createDomMarker({
      draggable: !1,
      anchor: "center",
      element: s
    }, [0, 0]);
  }
  getControlMarkerData() {
    const e = this.gm.markerPointer.marker;
    return e ? {
      type: "dom",
      instance: e,
      position: {
        coordinate: e.getLngLat(),
        path: [-1]
      }
    } : null;
  }
  fireStartEvent(e, s) {
    const u = {
      level: "system",
      type: "draw",
      mode: this.shape,
      variant: null,
      action: "start",
      featureData: e,
      markerData: s
    };
    this.gm.events.fire(`${pe}:draw`, u);
  }
  fireUpdateEvent(e, s) {
    const u = {
      level: "system",
      type: "draw",
      mode: this.shape,
      variant: null,
      action: "update",
      featureData: e,
      markerData: s
    };
    this.gm.events.fire(`${pe}:draw`, u);
  }
  fireFinishEvent() {
    const e = {
      level: "system",
      type: "draw",
      mode: this.shape,
      variant: null,
      action: "finish"
    };
    this.gm.events.fire(`${pe}:draw`, e);
  }
}
class Y2 extends pd {
  constructor() {
    super(...arguments);
    R(this, "mode", "circle_marker");
    R(this, "shape", "circle_marker");
  }
  onStartAction() {
    this.gm.markerPointer.enable({
      customMarker: this.createMarker()
    });
  }
  onEndAction() {
    this.fireMarkerPointerFinishEvent(), super.onEndAction();
  }
  onMouseMove() {
    return this.fireMarkerPointerUpdateEvent(), { next: !0 };
  }
  onMouseClick(e) {
    var u;
    const s = ((u = this.gm.markerPointer.marker) == null ? void 0 : u.getLngLat()) || e.lngLat.toArray();
    return this.fireBeforeFeatureCreate({ geoJsonFeatures: [this.getFeatureGeoJson(s)] }), this.flags.featureCreateAllowed && (this.featureData = this.createFeature(), this.circleCenterLngLat = s, this.circleCenterPoint = this.gm.mapAdapter.project(this.circleCenterLngLat), this.updateFeaturePosition(this.circleCenterLngLat), this.saveFeature()), { next: !1 };
  }
  updateFeaturePosition(e) {
    if (!this.featureData)
      return;
    const s = this.getFeatureGeoJson(e);
    this.featureData.updateGeoJsonGeometry(s.geometry);
  }
}
const H2 = () => "ontouchstart" in window || navigator.maxTouchPoints > 0 || matchMedia("(hover: none)").matches ? !0 : "msMaxTouchPoints" in navigator && typeof navigator.msMaxTouchPoints == "number" && navigator.msMaxTouchPoints > 0, Mi = (n, r, e = 10) => {
  const s = { ...n };
  return ft(n).forEach((u) => {
    const c = n[u];
    typeof c == "function" ? s[u] = Wf(
      c.bind(r),
      e,
      { leading: !0, trailing: !1 }
    ) : ae.error("convertToThrottled: item is not a function", n[u]);
  }), s;
}, J2 = (n, r, e = 10) => {
  const s = { ...n };
  return ft(n).forEach((u) => {
    const c = n[u];
    typeof c == "function" ? s[u] = Uu(
      c.bind(r),
      e,
      { leading: !1, trailing: !0 }
    ) : ae.error("convertToDebounced: item is not a function", n[u]);
  }), s;
};
class V2 extends pd {
  constructor() {
    super(...arguments);
    R(this, "mode", "circle");
    R(this, "shape", "circle");
    R(this, "throttledMethods", Mi({
      updateFeatureGeoJson: this.updateFeatureGeoJson
    }, this, this.gm.options.settings.throttlingDelay));
  }
  onMouseClick(e) {
    var u;
    if (!st(e))
      return { next: !0 };
    const s = ((u = this.gm.markerPointer.marker) == null ? void 0 : u.getLngLat()) || e.lngLat.toArray();
    if (this.circleCenterPoint && this.circleCenterLngLat)
      this.fireBeforeFeatureCreate({
        geoJsonFeatures: [this.getCircleGeoJson(this.circleCenterLngLat, s)]
      }), this.flags.featureCreateAllowed && (this.saveCircleFeature(s), this.circleCenterLngLat = null, this.circleCenterPoint = null, this.fireFinishEvent());
    else if (this.fireBeforeFeatureCreate({ geoJsonFeatures: [this.getFeatureGeoJson(s)] }), this.flags.featureCreateAllowed) {
      this.circleCenterLngLat = s, this.circleCenterPoint = this.gm.mapAdapter.project(this.circleCenterLngLat), this.featureData = this.createFeature();
      const c = this.getControlMarkerData();
      this.featureData && c && this.fireStartEvent(this.featureData, c);
    }
    return { next: !1 };
  }
  onMouseMove() {
    if (this.circleCenterLngLat && this.gm.markerPointer.marker) {
      const e = this.gm.markerPointer.marker.getLngLat();
      this.fireBeforeFeatureCreate({
        geoJsonFeatures: [this.getCircleGeoJson(this.circleCenterLngLat, e)]
      }), this.flags.featureCreateAllowed && this.throttledMethods.updateFeatureGeoJson(e);
    }
    return this.circleCenterPoint || this.fireMarkerPointerUpdateEvent(), { next: !1 };
  }
  updateFeatureGeoJson(e) {
    if (this.featureData && this.circleCenterLngLat) {
      const s = this.getCircleGeoJson(this.circleCenterLngLat, e);
      this.featureData.updateGeoJsonGeometry(s.geometry);
      const u = this.getControlMarkerData();
      u && this.fireUpdateEvent(this.featureData, u);
    }
  }
  saveCircleFeature(e) {
    var s;
    if (this.circleCenterLngLat && this.featureData) {
      const u = ((s = this.gm.markerPointer.marker) == null ? void 0 : s.getLngLat()) || e;
      this.updateFeatureGeoJson(u), this.featureData.setShapeProperty("center", this.circleCenterLngLat), this.isFeatureGeoJsonValid() ? this.saveFeature() : this.removeTmpFeature();
    }
  }
  isFeatureGeoJsonValid() {
    return this.featureData ? jf(this.featureData.getGeoJson()) : !1;
  }
  getCircleGeoJson(e, s) {
    const u = this.gm.mapAdapter.getDistance(e, s);
    return {
      ...Vu({ center: e, radius: u }),
      properties: {
        shape: this.shape
      }
    };
  }
}
const X2 = `<svg xmlns="http://www.w3.org/2000/svg" width="21" height="21">
    <circle cx="10.5" cy="10.5" r="9.213" fill="#fff" stroke="#278cda" stroke-width="2.303"/>
</svg>
`, W2 = {
  dom: X2
}, md = (n, r = void 0) => {
  const e = document.createElement("div");
  e.classList.add("marker-wrapper"), e.style.lineHeight = "0", e.innerHTML = W2[n];
  const s = e.firstChild;
  return r && Object.assign(s.style, r), e;
};
function Z2(n, r = {}) {
  var e, s, u, c = r.properties, f = (e = r.autoComplete) != null ? e : !0, h = (s = r.orderCoords) != null ? s : !0, m = (u = r.mutate) != null ? u : !1;
  switch (m || (n = Va(n)), n.type) {
    case "FeatureCollection":
      var d = [];
      return n.features.forEach(function(y) {
        d.push(
          Pt(Oh(y, {}, f, h))
        );
      }), Mu(d, c);
    default:
      return Oh(n, c, f, h);
  }
}
function Oh(n, r, e, s) {
  r = r || (n.type === "Feature" ? n.properties : {});
  var u = _s(n), c = u.coordinates, f = u.type;
  if (!c.length) throw new Error("line must contain coordinates");
  switch (f) {
    case "LineString":
      return e && (c = Ph(c)), or([c], r);
    case "MultiLineString":
      var h = [], m = 0;
      return c.forEach(function(d) {
        if (e && (d = Ph(d)), s) {
          var y = j2(wn(ls(d)));
          y > m ? (h.unshift(d), m = y) : h.push(d);
        } else
          h.push(d);
      }), or(h, r);
    default:
      throw new Error("geometry type " + f + " is not supported");
  }
}
function Ph(n) {
  var r = n[0], e = r[0], s = r[1], u = n[n.length - 1], c = u[0], f = u[1];
  return (e !== c || s !== f) && n.push(r), n;
}
function j2(n) {
  var r = n[0], e = n[1], s = n[2], u = n[3];
  return Math.abs(r - s) * Math.abs(e - u);
}
var gl = Z2;
const vd = (n) => !!n && typeof n == "object" && n instanceof pr && "removeSnapGuides" in n && "updateSnapGuides" in n && n.mode === "snap_guides" && typeof n.removeSnapGuides == "function" && typeof n.updateSnapGuides == "function", $2 = (n) => !!n && typeof n == "object" && n instanceof pr && "getShortestPath" in n && n.mode === "auto_trace" && typeof n.getShortestPath == "function", K2 = (n) => !!n && typeof n == "object" && n instanceof pr && "getSharedMarkers" in n && n.mode === "pin" && typeof n.getSharedMarkers == "function";
class dl extends Wn {
  constructor(e, s = {
    snappingMarkers: "none",
    targetShape: "line"
  }) {
    super(e);
    R(this, "mode", "line");
    R(this, "snappingKey", "line_drawer");
    R(this, "drawOptions");
    R(this, "shapeLngLats", []);
    R(this, "throttledMethods", Mi({
      onMouseMove: this.onMouseMove
    }, this, this.gm.options.settings.throttlingDelay));
    R(this, "mapEventHandlers", {
      [`${pe}:helper`]: this.handleGmHelperEvent.bind(this),
      click: this.onMouseClick.bind(this),
      mousemove: this.throttledMethods.onMouseMove.bind(this)
    });
    R(this, "drawerEventHandlers", {
      firstMarkerClick: null,
      lastMarkerClick: null,
      nMarkerClick: null
    });
    this.drawOptions = s;
  }
  get snapGuidesInstance() {
    const e = this.gm.actionInstances.helper__snap_guides;
    return vd(e) ? e : null;
  }
  get autoTraceEnabled() {
    var e;
    return ((e = this.gm.options.controls.helper.auto_trace) == null ? void 0 : e.active) || !1;
  }
  get autoTraceHelperInstance() {
    return this.autoTraceEnabled && Object.values(this.gm.actionInstances).find($2) || null;
  }
  onStartAction() {
    this.gm.markerPointer.enable();
  }
  onEndAction() {
    var e;
    this.gm.markerPointer.disable(), this.endShape(), (e = this.snapGuidesInstance) == null || e.removeSnapGuides();
  }
  handleGmHelperEvent(e) {
    return Ja(e) ? (e.mode === "snap_guides" && e.action === "mode_start" && this.updateSnapGuides(), { next: !0 }) : (ae.error("LineDrawer.handleGmHelperEvent: invalid event", e), { next: !0 });
  }
  updateSnapGuides() {
    var e;
    if (this.snapGuidesInstance) {
      const s = (e = this.featureData) == null ? void 0 : e.getGeoJson();
      s && s.geometry.coordinates.pop(), this.snapGuidesInstance.updateSnapGuides(
        s || null,
        this.shapeLngLats.at(-1) || null,
        !0
      );
    }
  }
  on(e, s) {
    this.drawerEventHandlers[e] = s;
  }
  onMouseClick(e) {
    var u;
    if (!st(e, { warning: !0 }))
      return { next: !0 };
    const s = ((u = this.gm.markerPointer.marker) == null ? void 0 : u.getLngLat()) || e.lngLat.toArray();
    if (this.featureData) {
      const c = this.getClickedMarkerInfo(e);
      this.handleNextVertex(s, c);
    } else this.isFeatureAllowed(q_(s)) && this.startShape(s);
    return this.updateSnapGuides(), { next: !0 };
  }
  handleNextVertex(e, s) {
    var f, h, m, d, y, _;
    if (!this.featureData) {
      ae.error("LineDrawer.handleNextVertex: no featureData");
      return;
    }
    const u = this.featureData.markers.size, c = this.getMarkerClickEventData(s.index);
    s.index < u - 1 && this.addPoint(e, s), s.index !== -1 && (s.index === 0 ? (h = (f = this.drawerEventHandlers).firstMarkerClick) == null || h.call(f, c) : s.index > 0 && s.index === u - 1 && ((d = (m = this.drawerEventHandlers).lastMarkerClick) == null || d.call(m, c)), s.index >= 0 && ((_ = (y = this.drawerEventHandlers).nMarkerClick) == null || _.call(y, c)));
  }
  getMarkerClickEventData(e) {
    const s = this.getFeatureGeoJson({ withControlMarker: !1 });
    return {
      markerIndex: e,
      shapeCoordinates: this.getShapeCoordinates({ withControlMarker: !1 }),
      geoJson: s,
      bounds: Ju(s)
    };
  }
  onMouseMove(e) {
    return st(e, { warning: !0 }) ? (this.featureData && this.shapeLngLats.length && this.updateFeatureSource(), { next: !0 }) : { next: !0 };
  }
  startShape(e) {
    this.shapeLngLats = [e], this.featureData = this.gm.features.createFeature({
      shapeGeoJson: this.getFeatureGeoJson({ withControlMarker: !0 }),
      sourceName: ee.temporary
    });
    const s = {
      type: "dom",
      instance: this.createMarker(e),
      position: {
        coordinate: e,
        path: ["geometry", "coordinates", 0]
      }
    };
    this.featureData && (this.featureData.markers.set(
      s.position.path.join("."),
      s
    ), this.setSnapping(), this.fireStartEvent(this.featureData, s)), this.gm.mapAdapter.disableMapInteractions(["doubleClickZoom"]);
  }
  endShape() {
    const e = this.getFeatureGeoJson({ withControlMarker: !1 });
    this.removeSnapping(), this.removeTmpFeature(), this.shapeLngLats = [], this.gm.mapAdapter.enableMapInteractions(["doubleClickZoom"]), this.fireStopEvent(e);
  }
  setSnapping() {
    if (!this.snappingHelper)
      return;
    const e = this.drawOptions.snappingMarkers;
    e === "none" ? this.snappingHelper.setCustomSnappingCoordinates(this.snappingKey, []) : e === "all" && this.shapeLngLats.length ? this.snappingHelper.setCustomSnappingCoordinates(this.snappingKey, this.shapeLngLats) : e === "first" && this.shapeLngLats.length ? this.snappingHelper.setCustomSnappingCoordinates(this.snappingKey, [this.shapeLngLats[0]]) : e === "last" && this.shapeLngLats.length ? this.snappingHelper.setCustomSnappingCoordinates(
      this.snappingKey,
      [this.shapeLngLats[this.shapeLngLats.length - 1]]
    ) : ae.error("LineDrawer.setSnapping: invalid data", e, this.shapeLngLats);
  }
  removeSnapping() {
    this.snappingHelper && this.snappingHelper.clearCustomSnappingCoordinates(this.snappingKey);
  }
  getClickedMarkerInfo(e) {
    if (!this.featureData)
      return { index: -1, path: null };
    let s = 0, u = null;
    try {
      this.featureData.markers.forEach((c, f) => {
        if (c.instance instanceof Su) {
          const h = c.instance.getElement() || null, m = e.originalEvent.target, d = m instanceof Element ? m : null;
          if (h && h.contains(d))
            throw u = f, new Error("stop");
        }
        s += 1;
      });
    } catch {
      if (u)
        return { index: s, path: u };
    }
    return { index: -1, path: null };
  }
  addPoint(e, s) {
    const u = this.featureData;
    if (!u) {
      ae.error("LineDrawer.addPoint: no featureData");
      return;
    }
    const c = this.getAddedLngLats(e, s), f = this.getFeatureGeoJsonWithType({
      withControlMarker: !0,
      coordinates: this.shapeLngLats.concat(c)
    });
    this.isFeatureAllowed(f) && (c.forEach((h) => {
      this.shapeLngLats.push(h);
      const m = this.addMarker(h, u);
      this.fireUpdateEvent(u, m);
    }), this.updateFeatureSource());
  }
  isFeatureAllowed(e) {
    return this.gm.getActiveDrawModes().length ? (this.fireBeforeFeatureCreate({ geoJsonFeatures: [e] }), this.flags.featureCreateAllowed) : !0;
  }
  getAddedLngLats(e, s) {
    if (!this.featureData)
      return ae.error("LineDrawer.getCurrentLngLats: no featureData"), [];
    const c = this.getMarkerInfoLngLat(s) || e, f = this.getAutoTracePath(c);
    return [
      ...(f == null ? void 0 : f.slice(1, -1)) || [],
      c
    ];
  }
  getAutoTracePath(e) {
    const s = this.shapeLngLats.at(-1);
    return this.autoTraceEnabled && this.autoTraceHelperInstance && s && this.autoTraceHelperInstance.getShortestPath(
      s,
      e
    ) || null;
  }
  getMarkerInfoLngLat(e) {
    if (this.featureData && e.path) {
      const s = this.featureData.markers.get(e.path);
      if (s && s.type === "dom")
        return s.instance.getLngLat();
      ae.error("LineDrawer.addPoint: no markerData", e);
    }
    return null;
  }
  addMarker(e, s) {
    const u = {
      type: "dom",
      instance: this.createMarker(e),
      position: {
        coordinate: e,
        path: ["geometry", "coordinates", this.shapeLngLats.length]
      }
    };
    return s.markers.set(
      u.position.path.join("."),
      {
        type: "dom",
        instance: u.instance,
        position: {
          coordinate: e,
          path: []
        }
      }
    ), u;
  }
  createMarker(e) {
    return this.gm.mapAdapter.createDomMarker({
      element: md("dom", {
        pointerEvents: "auto",
        cursor: "pointer"
      }),
      anchor: "center"
    }, e);
  }
  updateFeatureSource() {
    if (this.featureData && (this.featureData.updateGeoJsonGeometry(
      this.getFeatureGeoJson({ withControlMarker: !0 }).geometry
    ), this.gm.markerPointer.marker)) {
      const e = {
        type: "dom",
        instance: this.gm.markerPointer.marker,
        position: {
          coordinate: this.gm.markerPointer.marker.getLngLat(),
          path: ["geometry", "coordinates", this.shapeLngLats.length]
        }
      };
      this.fireUpdateEvent(this.featureData, e);
    }
  }
  getFeatureGeoJson({ withControlMarker: e, coordinates: s = void 0 }) {
    return {
      type: "Feature",
      properties: {
        shape: "line"
      },
      geometry: {
        type: "LineString",
        coordinates: s || this.getShapeCoordinates({ withControlMarker: e })
      }
    };
  }
  getFeatureGeoJsonWithType({ withControlMarker: e, coordinates: s = void 0 }) {
    const u = this.getFeatureGeoJson({ withControlMarker: e, coordinates: s });
    return this.drawOptions.targetShape === "polygon" && u.geometry.coordinates.length > 3 ? gl(
      u,
      { properties: u.properties }
    ) : u;
  }
  getShapeCoordinates({ withControlMarker: e }) {
    const s = [...this.shapeLngLats];
    return e && this.gm.markerPointer.marker && s.push(this.gm.markerPointer.marker.getLngLat()), s;
  }
  fireStartEvent(e, s) {
    this.gm.events.fire(
      `${pe}:draw`,
      {
        level: "system",
        type: "draw",
        mode: "line",
        variant: "line_drawer",
        action: "start",
        featureData: e,
        markerData: s
      }
    );
  }
  fireUpdateEvent(e, s) {
    this.gm.events.fire(
      `${pe}:draw`,
      {
        level: "system",
        type: "draw",
        mode: "line",
        variant: "line_drawer",
        action: "update",
        featureData: e,
        markerData: s
      }
    );
  }
  fireStopEvent(e) {
    this.gm.events.fire(`${pe}:draw`, {
      level: "system",
      type: "draw",
      mode: "line",
      action: "finish",
      variant: "line_drawer",
      geoJsonFeature: e
    });
  }
}
class Q2 extends Wn {
  constructor() {
    super(...arguments);
    R(this, "mode", "line");
    R(this, "shape", "line");
    R(this, "lineDrawer", new dl(
      this.gm,
      { snappingMarkers: "first", targetShape: "line" }
    ));
    R(this, "mapEventHandlers", {
      [`${pe}:draw`]: this.forwardLineDrawerEvent.bind(this),
      mousemove: this.onMouseMove.bind(this)
    });
  }
  onStartAction() {
    this.lineDrawer.startAction(), this.lineDrawer.on("nMarkerClick", this.lineFinished.bind(this));
  }
  onEndAction() {
    this.lineDrawer.endAction();
  }
  onMouseMove(e) {
    return st(e) ? (this.lineDrawer.featureData || this.fireMarkerPointerUpdateEvent(), { next: !0 }) : { next: !0 };
  }
  lineFinished(e) {
    this.lineDrawer.endShape();
    let s = e.shapeCoordinates;
    return e.markerIndex > 0 && (s = s.slice(0, e.markerIndex + 1)), s.length < 2 ? null : this.gm.features.createFeature({
      shapeGeoJson: this.getFeatureGeoJson(s),
      sourceName: ee.main
    });
  }
  getFeatureGeoJson(e) {
    return {
      type: "Feature",
      properties: {
        shape: this.shape
      },
      geometry: {
        type: "LineString",
        coordinates: e
      }
    };
  }
}
class ek extends Wn {
  constructor() {
    super(...arguments);
    R(this, "mode", "marker");
    R(this, "shape", "marker");
    R(this, "mapEventHandlers", {
      click: this.onMouseClick.bind(this),
      mousemove: this.onMouseMove.bind(this)
    });
  }
  onStartAction() {
    const e = this.createMarker();
    this.gm.markerPointer.enable({ customMarker: e }), this.fireMarkerPointerStartEvent();
  }
  onEndAction() {
    this.gm.markerPointer.disable(), this.fireMarkerPointerFinishEvent();
  }
  onMouseClick(e) {
    return st(e) && (this.featureData = this.createFeature(e), this.featureData && this.saveFeature()), { next: !1 };
  }
  onMouseMove(e) {
    return !st(e) || !this.gm.markerPointer.marker ? { next: !0 } : (this.fireMarkerPointerUpdateEvent(), { next: !0 });
  }
  createMarker() {
    const e = document.createElement("div");
    return e.style.backgroundImage = `url("${of}")`, e.style.width = "36px", e.style.height = "36px", e.style.backgroundSize = "cover", e.style.pointerEvents = "none", this.gm.mapAdapter.createDomMarker({
      draggable: !1,
      anchor: "bottom",
      element: e
    }, [0, 0]);
  }
  createFeature(e) {
    var c;
    const s = ((c = this.gm.markerPointer.marker) == null ? void 0 : c.getLngLat()) || e.lngLat.toArray(), u = this.getFeatureGeoJson(s);
    return u && (this.fireBeforeFeatureCreate({ geoJsonFeatures: [u] }), this.flags.featureCreateAllowed) ? this.gm.features.createFeature({
      shapeGeoJson: u,
      sourceName: ee.temporary
    }) : null;
  }
  getFeatureGeoJson(e) {
    return {
      type: "Feature",
      properties: {
        shape: this.shape
      },
      geometry: {
        type: "Point",
        coordinates: e
      }
    };
  }
}
function tk(n) {
  var r = {
    MultiPoint: {
      coordinates: [],
      properties: []
    },
    MultiLineString: {
      coordinates: [],
      properties: []
    },
    MultiPolygon: {
      coordinates: [],
      properties: []
    }
  };
  return Tn(n, (e) => {
    var s;
    switch ((s = e.geometry) == null ? void 0 : s.type) {
      case "Point":
        r.MultiPoint.coordinates.push(e.geometry.coordinates), r.MultiPoint.properties.push(e.properties);
        break;
      case "MultiPoint":
        r.MultiPoint.coordinates.push(...e.geometry.coordinates), r.MultiPoint.properties.push(e.properties);
        break;
      case "LineString":
        r.MultiLineString.coordinates.push(e.geometry.coordinates), r.MultiLineString.properties.push(e.properties);
        break;
      case "MultiLineString":
        r.MultiLineString.coordinates.push(
          ...e.geometry.coordinates
        ), r.MultiLineString.properties.push(e.properties);
        break;
      case "Polygon":
        r.MultiPolygon.coordinates.push(e.geometry.coordinates), r.MultiPolygon.properties.push(e.properties);
        break;
      case "MultiPolygon":
        r.MultiPolygon.coordinates.push(...e.geometry.coordinates), r.MultiPolygon.properties.push(e.properties);
        break;
    }
  }), Ke(
    Object.keys(r).filter(function(e) {
      return r[e].coordinates.length;
    }).sort().map(function(e) {
      var s = { type: e, coordinates: r[e].coordinates }, u = { collectedProperties: r[e].properties };
      return cn(s, u);
    })
  );
}
var nk = tk;
function rk(n, r, e, s, u) {
  yd(n, r, e || 0, s || n.length - 1, u || ik);
}
function yd(n, r, e, s, u) {
  for (; s > e; ) {
    if (s - e > 600) {
      var c = s - e + 1, f = r - e + 1, h = Math.log(c), m = 0.5 * Math.exp(2 * h / 3), d = 0.5 * Math.sqrt(h * m * (c - m) / c) * (f - c / 2 < 0 ? -1 : 1), y = Math.max(e, Math.floor(r - f * m / c + d)), _ = Math.min(s, Math.floor(r + (c - f) * m / c + d));
      yd(n, r, y, _, u);
    }
    var E = n[r], S = e, I = s;
    for (Xi(n, e, r), u(n[s], E) > 0 && Xi(n, e, s); S < I; ) {
      for (Xi(n, S, I), S++, I--; u(n[S], E) < 0; ) S++;
      for (; u(n[I], E) > 0; ) I--;
    }
    u(n[e], E) === 0 ? Xi(n, e, I) : (I++, Xi(n, I, s)), I <= r && (e = I + 1), r <= I && (s = I - 1);
  }
}
function Xi(n, r, e) {
  var s = n[r];
  n[r] = n[e], n[e] = s;
}
function ik(n, r) {
  return n < r ? -1 : n > r ? 1 : 0;
}
class Vt {
  constructor(r = 9) {
    this._maxEntries = Math.max(4, r), this._minEntries = Math.max(2, Math.ceil(this._maxEntries * 0.4)), this.clear();
  }
  all() {
    return this._all(this.data, []);
  }
  search(r) {
    let e = this.data;
    const s = [];
    if (!Xs(r, e)) return s;
    const u = this.toBBox, c = [];
    for (; e; ) {
      for (let f = 0; f < e.children.length; f++) {
        const h = e.children[f], m = e.leaf ? u(h) : h;
        Xs(r, m) && (e.leaf ? s.push(h) : Go(r, m) ? this._all(h, s) : c.push(h));
      }
      e = c.pop();
    }
    return s;
  }
  collides(r) {
    let e = this.data;
    if (!Xs(r, e)) return !1;
    const s = [];
    for (; e; ) {
      for (let u = 0; u < e.children.length; u++) {
        const c = e.children[u], f = e.leaf ? this.toBBox(c) : c;
        if (Xs(r, f)) {
          if (e.leaf || Go(r, f)) return !0;
          s.push(c);
        }
      }
      e = s.pop();
    }
    return !1;
  }
  load(r) {
    if (!(r && r.length)) return this;
    if (r.length < this._minEntries) {
      for (let s = 0; s < r.length; s++)
        this.insert(r[s]);
      return this;
    }
    let e = this._build(r.slice(), 0, r.length - 1, 0);
    if (!this.data.children.length)
      this.data = e;
    else if (this.data.height === e.height)
      this._splitRoot(this.data, e);
    else {
      if (this.data.height < e.height) {
        const s = this.data;
        this.data = e, e = s;
      }
      this._insert(e, this.data.height - e.height - 1, !0);
    }
    return this;
  }
  insert(r) {
    return r && this._insert(r, this.data.height - 1), this;
  }
  clear() {
    return this.data = ti([]), this;
  }
  remove(r, e) {
    if (!r) return this;
    let s = this.data;
    const u = this.toBBox(r), c = [], f = [];
    let h, m, d;
    for (; s || c.length; ) {
      if (s || (s = c.pop(), m = c[c.length - 1], h = f.pop(), d = !0), s.leaf) {
        const y = sk(r, s.children, e);
        if (y !== -1)
          return s.children.splice(y, 1), c.push(s), this._condense(c), this;
      }
      !d && !s.leaf && Go(s, u) ? (c.push(s), f.push(h), h = 0, m = s, s = s.children[0]) : m ? (h++, s = m.children[h], d = !1) : s = null;
    }
    return this;
  }
  toBBox(r) {
    return r;
  }
  compareMinX(r, e) {
    return r.minX - e.minX;
  }
  compareMinY(r, e) {
    return r.minY - e.minY;
  }
  toJSON() {
    return this.data;
  }
  fromJSON(r) {
    return this.data = r, this;
  }
  _all(r, e) {
    const s = [];
    for (; r; )
      r.leaf ? e.push(...r.children) : s.push(...r.children), r = s.pop();
    return e;
  }
  _build(r, e, s, u) {
    const c = s - e + 1;
    let f = this._maxEntries, h;
    if (c <= f)
      return h = ti(r.slice(e, s + 1)), Qr(h, this.toBBox), h;
    u || (u = Math.ceil(Math.log(c) / Math.log(f)), f = Math.ceil(c / Math.pow(f, u - 1))), h = ti([]), h.leaf = !1, h.height = u;
    const m = Math.ceil(c / f), d = m * Math.ceil(Math.sqrt(f));
    Rh(r, e, s, d, this.compareMinX);
    for (let y = e; y <= s; y += d) {
      const _ = Math.min(y + d - 1, s);
      Rh(r, y, _, m, this.compareMinY);
      for (let E = y; E <= _; E += m) {
        const S = Math.min(E + m - 1, _);
        h.children.push(this._build(r, E, S, u - 1));
      }
    }
    return Qr(h, this.toBBox), h;
  }
  _chooseSubtree(r, e, s, u) {
    for (; u.push(e), !(e.leaf || u.length - 1 === s); ) {
      let c = 1 / 0, f = 1 / 0, h;
      for (let m = 0; m < e.children.length; m++) {
        const d = e.children[m], y = Fo(d), _ = uk(r, d) - y;
        _ < f ? (f = _, c = y < c ? y : c, h = d) : _ === f && y < c && (c = y, h = d);
      }
      e = h || e.children[0];
    }
    return e;
  }
  _insert(r, e, s) {
    const u = s ? r : this.toBBox(r), c = [], f = this._chooseSubtree(u, this.data, e, c);
    for (f.children.push(r), Qi(f, u); e >= 0 && c[e].children.length > this._maxEntries; )
      this._split(c, e), e--;
    this._adjustParentBBoxes(u, c, e);
  }
  // split overflowed node into two
  _split(r, e) {
    const s = r[e], u = s.children.length, c = this._minEntries;
    this._chooseSplitAxis(s, c, u);
    const f = this._chooseSplitIndex(s, c, u), h = ti(s.children.splice(f, s.children.length - f));
    h.height = s.height, h.leaf = s.leaf, Qr(s, this.toBBox), Qr(h, this.toBBox), e ? r[e - 1].children.push(h) : this._splitRoot(s, h);
  }
  _splitRoot(r, e) {
    this.data = ti([r, e]), this.data.height = r.height + 1, this.data.leaf = !1, Qr(this.data, this.toBBox);
  }
  _chooseSplitIndex(r, e, s) {
    let u, c = 1 / 0, f = 1 / 0;
    for (let h = e; h <= s - e; h++) {
      const m = Ki(r, 0, h, this.toBBox), d = Ki(r, h, s, this.toBBox), y = lk(m, d), _ = Fo(m) + Fo(d);
      y < c ? (c = y, u = h, f = _ < f ? _ : f) : y === c && _ < f && (f = _, u = h);
    }
    return u || s - e;
  }
  // sorts node children by the best axis for split
  _chooseSplitAxis(r, e, s) {
    const u = r.leaf ? this.compareMinX : ak, c = r.leaf ? this.compareMinY : ok, f = this._allDistMargin(r, e, s, u), h = this._allDistMargin(r, e, s, c);
    f < h && r.children.sort(u);
  }
  // total margin of all possible split distributions where each node is at least m full
  _allDistMargin(r, e, s, u) {
    r.children.sort(u);
    const c = this.toBBox, f = Ki(r, 0, e, c), h = Ki(r, s - e, s, c);
    let m = Vs(f) + Vs(h);
    for (let d = e; d < s - e; d++) {
      const y = r.children[d];
      Qi(f, r.leaf ? c(y) : y), m += Vs(f);
    }
    for (let d = s - e - 1; d >= e; d--) {
      const y = r.children[d];
      Qi(h, r.leaf ? c(y) : y), m += Vs(h);
    }
    return m;
  }
  _adjustParentBBoxes(r, e, s) {
    for (let u = s; u >= 0; u--)
      Qi(e[u], r);
  }
  _condense(r) {
    for (let e = r.length - 1, s; e >= 0; e--)
      r[e].children.length === 0 ? e > 0 ? (s = r[e - 1].children, s.splice(s.indexOf(r[e]), 1)) : this.clear() : Qr(r[e], this.toBBox);
  }
}
function sk(n, r, e) {
  if (!e) return r.indexOf(n);
  for (let s = 0; s < r.length; s++)
    if (e(n, r[s])) return s;
  return -1;
}
function Qr(n, r) {
  Ki(n, 0, n.children.length, r, n);
}
function Ki(n, r, e, s, u) {
  u || (u = ti(null)), u.minX = 1 / 0, u.minY = 1 / 0, u.maxX = -1 / 0, u.maxY = -1 / 0;
  for (let c = r; c < e; c++) {
    const f = n.children[c];
    Qi(u, n.leaf ? s(f) : f);
  }
  return u;
}
function Qi(n, r) {
  return n.minX = Math.min(n.minX, r.minX), n.minY = Math.min(n.minY, r.minY), n.maxX = Math.max(n.maxX, r.maxX), n.maxY = Math.max(n.maxY, r.maxY), n;
}
function ak(n, r) {
  return n.minX - r.minX;
}
function ok(n, r) {
  return n.minY - r.minY;
}
function Fo(n) {
  return (n.maxX - n.minX) * (n.maxY - n.minY);
}
function Vs(n) {
  return n.maxX - n.minX + (n.maxY - n.minY);
}
function uk(n, r) {
  return (Math.max(r.maxX, n.maxX) - Math.min(r.minX, n.minX)) * (Math.max(r.maxY, n.maxY) - Math.min(r.minY, n.minY));
}
function lk(n, r) {
  const e = Math.max(n.minX, r.minX), s = Math.max(n.minY, r.minY), u = Math.min(n.maxX, r.maxX), c = Math.min(n.maxY, r.maxY);
  return Math.max(0, u - e) * Math.max(0, c - s);
}
function Go(n, r) {
  return n.minX <= r.minX && n.minY <= r.minY && r.maxX <= n.maxX && r.maxY <= n.maxY;
}
function Xs(n, r) {
  return r.minX <= n.maxX && r.minY <= n.maxY && r.maxX >= n.minX && r.maxY >= n.minY;
}
function ti(n) {
  return {
    children: n,
    height: 1,
    leaf: !0,
    minX: 1 / 0,
    minY: 1 / 0,
    maxX: -1 / 0,
    maxY: -1 / 0
  };
}
function Rh(n, r, e, s, u) {
  const c = [r, e];
  for (; c.length; ) {
    if (e = c.pop(), r = c.pop(), e - r <= s) continue;
    const f = r + Math.ceil((e - r) / s / 2) * s;
    rk(n, f, r, e, u), c.push(r, f, f, e);
  }
}
function ck(n) {
  return am(
    n,
    (r, e) => r + hk(e),
    0
  );
}
function hk(n) {
  let r = 0, e;
  switch (n.type) {
    case "Polygon":
      return Dh(n.coordinates);
    case "MultiPolygon":
      for (e = 0; e < n.coordinates.length; e++)
        r += Dh(n.coordinates[e]);
      return r;
    case "Point":
    case "MultiPoint":
    case "LineString":
    case "MultiLineString":
      return 0;
  }
  return 0;
}
function Dh(n) {
  let r = 0;
  if (n && n.length > 0) {
    r += Math.abs(Fh(n[0]));
    for (let e = 1; e < n.length; e++)
      r -= Math.abs(Fh(n[e]));
  }
  return r;
}
var fk = nt * nt / 2, Bo = Math.PI / 180;
function Fh(n) {
  const r = n.length - 1;
  if (r <= 2) return 0;
  let e = 0, s = 0;
  for (; s < r; ) {
    const u = n[s], c = n[s + 1 === r ? 0 : s + 1], f = n[s + 2 >= r ? (s + 2) % r : s + 2], h = u[0] * Bo, m = c[1] * Bo, d = f[0] * Bo;
    e += (d - h) * Math.sin(m), s++;
  }
  return e * fk;
}
function gk(n, r, e) {
  if (n.geometry.type !== "Polygon")
    throw new Error("The input feature must be a Polygon");
  e === void 0 && (e = 1);
  var s = n.geometry.coordinates, u = [], c = {};
  if (e) {
    for (var f = [], h = 0; h < s.length; h++)
      for (var m = 0; m < s[h].length - 1; m++)
        f.push(q(h, m));
    var d = new Vt();
    d.load(f);
  }
  for (var y = 0; y < s.length; y++)
    for (var _ = 0; _ < s[y].length - 1; _++)
      if (e) {
        var E = d.search(q(y, _));
        E.forEach(function(G) {
          var M = G.ring, H = G.edge;
          D(y, _, M, H);
        });
      } else
        for (var S = 0; S < s.length; S++)
          for (var I = 0; I < s[S].length - 1; I++)
            D(y, _, S, I);
  return r || (u = {
    type: "Feature",
    geometry: { type: "MultiPoint", coordinates: u }
  }), u;
  function D(G, M, H, V) {
    var X = s[G][M], j = s[G][M + 1], $ = s[H][V], x = s[H][V + 1], k = dk(X, j, $, x);
    if (k !== null) {
      var T, L;
      if (j[0] !== X[0] ? T = (k[0] - X[0]) / (j[0] - X[0]) : T = (k[1] - X[1]) / (j[1] - X[1]), x[0] !== $[0] ? L = (k[0] - $[0]) / (x[0] - $[0]) : L = (k[1] - $[1]) / (x[1] - $[1]), !(T >= 1 || T <= 0 || L >= 1 || L <= 0)) {
        var A = k, F = !c[A];
        F && (c[A] = !0), r ? u.push(
          r(
            k,
            G,
            M,
            X,
            j,
            T,
            H,
            V,
            $,
            x,
            L,
            F
          )
        ) : u.push(k);
      }
    }
  }
  function q(G, M) {
    var H = s[G][M], V = s[G][M + 1], X, j, $, x;
    return H[0] < V[0] ? (X = H[0], j = V[0]) : (X = V[0], j = H[0]), H[1] < V[1] ? ($ = H[1], x = V[1]) : ($ = V[1], x = H[1]), {
      minX: X,
      minY: $,
      maxX: j,
      maxY: x,
      ring: G,
      edge: M
    };
  }
}
function dk(n, r, e, s) {
  if (es(n, e) || es(n, s) || es(r, e) || es(s, e))
    return null;
  var u = n[0], c = n[1], f = r[0], h = r[1], m = e[0], d = e[1], y = s[0], _ = s[1], E = (u - f) * (d - _) - (c - h) * (m - y);
  if (E === 0) return null;
  var S = ((u * h - c * f) * (m - y) - (u - f) * (m * _ - d * y)) / E, I = ((u * h - c * f) * (d - _) - (c - h) * (m * _ - d * y)) / E;
  return [S, I];
}
function es(n, r) {
  if (!n || !r || n.length !== r.length) return !1;
  for (var e = 0, s = n.length; e < s; e++)
    if (n[e] instanceof Array && r[e] instanceof Array) {
      if (!es(n[e], r[e])) return !1;
    } else if (n[e] !== r[e])
      return !1;
  return !0;
}
function pk(n) {
  if (n.type != "Feature")
    throw new Error("The input must a geojson object of type Feature");
  if (n.geometry === void 0 || n.geometry == null)
    throw new Error(
      "The input must a geojson object with a non-empty geometry"
    );
  if (n.geometry.type != "Polygon")
    throw new Error("The input must be a geojson Polygon");
  for (var r = n.geometry.coordinates.length, e = [], M = 0; M < r; M++) {
    var s = n.geometry.coordinates[M];
    ts(s[0], s[s.length - 1]) || s.push(s[0]);
    for (var u = 0; u < s.length - 1; u++)
      e.push(s[u]);
  }
  if (!vk(e))
    throw new Error(
      "The input polygon may not have duplicate vertices (except for the first and last vertex of each ring)"
    );
  var c = e.length, f = gk(
    n,
    function(se, ue, xe, Le, J, Kt, be, he, C, Pe, Oe, Se) {
      return [
        se,
        ue,
        xe,
        Le,
        J,
        Kt,
        be,
        he,
        C,
        Pe,
        Oe,
        Se
      ];
    }
  ), h = f.length;
  if (h == 0) {
    for (var $ = [], M = 0; M < r; M++)
      $.push(
        or([n.geometry.coordinates[M]], {
          parent: -1,
          winding: mk(n.geometry.coordinates[M])
        })
      );
    var Z = Ke($);
    return K(), re(), Z;
  }
  for (var m = [], d = [], M = 0; M < r; M++) {
    m.push([]);
    for (var u = 0; u < n.geometry.coordinates[M].length - 1; u++)
      m[M].push([
        new Gh(
          n.geometry.coordinates[M][ni(u + 1, n.geometry.coordinates[M].length - 1)],
          1,
          [M, u],
          [M, ni(u + 1, n.geometry.coordinates[M].length - 1)],
          void 0
        )
      ]), d.push(
        new Bh(
          n.geometry.coordinates[M][u],
          [M, ni(u - 1, n.geometry.coordinates[M].length - 1)],
          [M, u],
          void 0,
          void 0,
          !1,
          !0
        )
      );
  }
  for (var M = 0; M < h; M++)
    m[f[M][1]][f[M][2]].push(
      new Gh(
        f[M][0],
        f[M][5],
        [f[M][1], f[M][2]],
        [f[M][6], f[M][7]],
        void 0
      )
    ), f[M][11] && d.push(
      new Bh(
        f[M][0],
        [f[M][1], f[M][2]],
        [f[M][6], f[M][7]],
        void 0,
        void 0,
        !0,
        !0
      )
    );
  for (var y = d.length, M = 0; M < m.length; M++)
    for (var u = 0; u < m[M].length; u++)
      m[M][u].sort(function(ue, xe) {
        return ue.param < xe.param ? -1 : 1;
      });
  for (var _ = [], M = 0; M < y; M++)
    _.push({
      minX: d[M].coord[0],
      minY: d[M].coord[1],
      maxX: d[M].coord[0],
      maxY: d[M].coord[1],
      index: M
    });
  var E = new Vt();
  E.load(_);
  for (var M = 0; M < m.length; M++)
    for (var u = 0; u < m[M].length; u++)
      for (var S = 0; S < m[M][u].length; S++) {
        var I;
        S == m[M][u].length - 1 ? I = m[M][ni(u + 1, n.geometry.coordinates[M].length - 1)][0].coord : I = m[M][u][S + 1].coord;
        var D = E.search({
          minX: I[0],
          minY: I[1],
          maxX: I[0],
          maxY: I[1]
        })[0];
        m[M][u][S].nxtIsectAlongEdgeIn = D.index;
      }
  for (var M = 0; M < m.length; M++)
    for (var u = 0; u < m[M].length; u++)
      for (var S = 0; S < m[M][u].length; S++) {
        var I = m[M][u][S].coord, D = E.search({
          minX: I[0],
          minY: I[1],
          maxX: I[0],
          maxY: I[1]
        })[0], q = D.index;
        q < c ? d[q].nxtIsectAlongRingAndEdge2 = m[M][u][S].nxtIsectAlongEdgeIn : ts(
          d[q].ringAndEdge1,
          m[M][u][S].ringAndEdgeIn
        ) ? d[q].nxtIsectAlongRingAndEdge1 = m[M][u][S].nxtIsectAlongEdgeIn : d[q].nxtIsectAlongRingAndEdge2 = m[M][u][S].nxtIsectAlongEdgeIn;
      }
  for (var G = [], M = 0, u = 0; u < r; u++) {
    for (var H = M, S = 0; S < n.geometry.coordinates[u].length - 1; S++)
      d[M].coord[0] < d[H].coord[0] && (H = M), M++;
    for (var V = d[H].nxtIsectAlongRingAndEdge2, S = 0; S < d.length; S++)
      if (d[S].nxtIsectAlongRingAndEdge1 == H || d[S].nxtIsectAlongRingAndEdge2 == H) {
        var X = S;
        break;
      }
    var j = oa(
      [
        d[X].coord,
        d[H].coord,
        d[V].coord
      ],
      !0
    ) ? 1 : -1;
    G.push({ isect: H, parent: -1, winding: j });
  }
  G.sort(function(ce, se) {
    return d[ce.isect].coord > d[se.isect].coord ? -1 : 1;
  });
  for (var $ = []; G.length > 0; ) {
    var x = G.pop(), k = x.isect, T = x.parent, L = x.winding, A = $.length, F = [d[k].coord], O = k;
    if (d[k].ringAndEdge1Walkable)
      var N = d[k].ringAndEdge1, P = d[k].nxtIsectAlongRingAndEdge1;
    else
      var N = d[k].ringAndEdge2, P = d[k].nxtIsectAlongRingAndEdge2;
    for (; !ts(d[k].coord, d[P].coord); ) {
      F.push(d[P].coord);
      for (var Y = void 0, M = 0; M < G.length; M++)
        if (G[M].isect == P) {
          Y = M;
          break;
        }
      if (Y != null && G.splice(Y, 1), ts(N, d[P].ringAndEdge1)) {
        if (N = d[P].ringAndEdge2, d[P].ringAndEdge2Walkable = !1, d[P].ringAndEdge1Walkable) {
          var U = { isect: P };
          oa(
            [
              d[O].coord,
              d[P].coord,
              d[d[P].nxtIsectAlongRingAndEdge2].coord
            ],
            L == 1
          ) ? (U.parent = T, U.winding = -L) : (U.parent = A, U.winding = L), G.push(U);
        }
        O = P, P = d[P].nxtIsectAlongRingAndEdge2;
      } else {
        if (N = d[P].ringAndEdge1, d[P].ringAndEdge1Walkable = !1, d[P].ringAndEdge2Walkable) {
          var U = { isect: P };
          oa(
            [
              d[O].coord,
              d[P].coord,
              d[d[P].nxtIsectAlongRingAndEdge1].coord
            ],
            L == 1
          ) ? (U.parent = T, U.winding = -L) : (U.parent = A, U.winding = L), G.push(U);
        }
        O = P, P = d[P].nxtIsectAlongRingAndEdge1;
      }
    }
    F.push(d[P].coord), $.push(
      or([F], {
        index: A,
        parent: T,
        winding: L,
        netWinding: void 0
      })
    );
  }
  var Z = Ke($);
  K(), re();
  function K() {
    for (var ce = [], se = 0; se < Z.features.length; se++)
      Z.features[se].properties.parent == -1 && ce.push(se);
    if (ce.length > 1)
      for (var se = 0; se < ce.length; se++) {
        for (var ue = -1, xe = 1 / 0, Le = 0; Le < Z.features.length; Le++)
          ce[se] != Le && Cr(
            Z.features[ce[se]].geometry.coordinates[0][0],
            Z.features[Le],
            { ignoreBoundary: !0 }
          ) && ck(Z.features[Le]) < xe && (ue = Le);
        Z.features[ce[se]].properties.parent = ue;
      }
  }
  function re() {
    for (var ce = 0; ce < Z.features.length; ce++)
      if (Z.features[ce].properties.parent == -1) {
        var se = Z.features[ce].properties.winding;
        Z.features[ce].properties.netWinding = se, de(ce, se);
      }
  }
  function de(ce, se) {
    for (var ue = 0; ue < Z.features.length; ue++)
      if (Z.features[ue].properties.parent == ce) {
        var xe = se + Z.features[ue].properties.winding;
        Z.features[ue].properties.netWinding = xe, de(ue, xe);
      }
  }
  return Z;
}
var Gh = function(n, r, e, s, u) {
  this.coord = n, this.param = r, this.ringAndEdgeIn = e, this.ringAndEdgeOut = s, this.nxtIsectAlongEdgeIn = u;
}, Bh = function(n, r, e, s, u, c, f) {
  this.coord = n, this.ringAndEdge1 = r, this.ringAndEdge2 = e, this.nxtIsectAlongRingAndEdge1 = s, this.nxtIsectAlongRingAndEdge2 = u, this.ringAndEdge1Walkable = c, this.ringAndEdge2Walkable = f;
};
function oa(n, r) {
  if (typeof r > "u" && (r = !0), n.length != 3)
    throw new Error("This function requires an array of three points [x,y]");
  var e = (n[1][0] - n[0][0]) * (n[2][1] - n[0][1]) - (n[1][1] - n[0][1]) * (n[2][0] - n[0][0]);
  return e >= 0 == r;
}
function mk(n) {
  for (var r = 0, e = 0; e < n.length - 1; e++)
    n[e][0] < n[r][0] && (r = e);
  if (oa(
    [
      n[ni(r - 1, n.length - 1)],
      n[r],
      n[ni(r + 1, n.length - 1)]
    ],
    !0
  ))
    var s = 1;
  else
    var s = -1;
  return s;
}
function ts(n, r) {
  if (!n || !r || n.length != r.length) return !1;
  for (var e = 0, s = n.length; e < s; e++)
    if (n[e] instanceof Array && r[e] instanceof Array) {
      if (!ts(n[e], r[e])) return !1;
    } else if (n[e] != r[e])
      return !1;
  return !0;
}
function ni(n, r) {
  return (n % r + r) % r;
}
function vk(n) {
  for (var r = {}, e = 1, s = 0, u = n.length; s < u; ++s) {
    if (Object.prototype.hasOwnProperty.call(r, n[s])) {
      e = 0;
      break;
    }
    r[n[s]] = 1;
  }
  return e;
}
function yk(n) {
  var r = [];
  return ur(n, function(e) {
    e.geometry.type === "Polygon" && Tn(pk(e), function(s) {
      r.push(or(s.geometry.coordinates, e.properties));
    });
  }), Ke(r);
}
var _k = yk;
class Ek extends Wn {
  constructor() {
    super(...arguments);
    R(this, "mode", "polygon");
    R(this, "shape", "polygon");
    R(this, "lineDrawer", new dl(
      this.gm,
      { snappingMarkers: "first", targetShape: "polygon" }
    ));
    R(this, "mapEventHandlers", {
      [`${pe}:draw`]: this.forwardLineDrawerEvent.bind(this),
      mousemove: this.onMouseMove.bind(this)
    });
  }
  onEndAction() {
    this.lineDrawer.endAction();
  }
  onStartAction() {
    this.lineDrawer.startAction(), this.lineDrawer.on(
      "firstMarkerClick",
      this.polygonFinished.bind(this)
    );
  }
  onMouseMove(e) {
    return st(e) ? (this.lineDrawer.featureData || this.fireMarkerPointerUpdateEvent(), { next: !0 }) : { next: !0 };
  }
  polygonFinished(e) {
    if (this.lineDrawer.endShape(), e.shapeCoordinates.length < 3)
      return;
    const s = this.fixShapeGeoJson(gl(e.geoJson));
    s && this.gm.features.createFeature({
      shapeGeoJson: {
        ...s,
        properties: {
          ...s.properties,
          shape: this.shape
        }
      },
      sourceName: ee.main
    });
  }
  fixShapeGeoJson(e) {
    try {
      return ug(nk(_k(e))).features[0];
    } catch {
      return null;
    }
  }
}
class xk extends Wn {
  constructor() {
    super(...arguments);
    R(this, "mode", "rectangle");
    R(this, "shape", "rectangle");
    R(this, "startLngLat", null);
    R(this, "mapEventHandlers", {
      mousemove: this.onMouseMove.bind(this),
      click: this.onMouseClick.bind(this)
    });
    R(this, "throttledMethods", Mi({
      updateFeaturePosition: this.updateFeaturePosition
    }, this, this.gm.options.settings.throttlingDelay));
  }
  onStartAction() {
    this.gm.markerPointer.enable();
  }
  onEndAction() {
    this.removeTmpFeature(), this.startLngLat = null, this.gm.markerPointer.disable(), this.fireFinishEvent();
  }
  onMouseClick(e) {
    var u;
    if (!st(e, { warning: !0 }))
      return { next: !1 };
    const s = ((u = this.gm.markerPointer.marker) == null ? void 0 : u.getLngLat()) || e.lngLat.toArray();
    if (this.startLngLat) {
      const c = this.getFeatureGeoJson(
        ei(this.startLngLat, s)
      );
      this.fireBeforeFeatureCreate({ geoJsonFeatures: [c] }), this.flags.featureCreateAllowed && this.finishShape(s);
    } else {
      const c = this.getFeatureGeoJson(
        ei(s, s)
      );
      if (this.fireBeforeFeatureCreate({ geoJsonFeatures: [c] }), this.flags.featureCreateAllowed) {
        const f = this.startShape(s);
        if (f) {
          const h = this.getControlMarkerData(["geometry", "coordinates", 4]);
          this.fireStartEvent(f, h);
        }
      }
    }
    return { next: !1 };
  }
  onMouseMove(e) {
    var f;
    if (!st(e, { warning: !0 }))
      return { next: !1 };
    if (!this.startLngLat)
      return this.fireMarkerPointerUpdateEvent(), { next: !1 };
    const s = ((f = this.gm.markerPointer.marker) == null ? void 0 : f.getLngLat()) || e.lngLat.toArray(), u = ei(this.startLngLat, s), c = this.getFeatureGeoJson(u);
    return this.fireBeforeFeatureCreate({ geoJsonFeatures: [c] }), this.flags.featureCreateAllowed && this.throttledMethods.updateFeaturePosition(u), { next: !1 };
  }
  startShape(e) {
    this.startLngLat = e;
    const s = ei(this.startLngLat, this.startLngLat);
    return this.featureData = this.createFeature(s), this.featureData;
  }
  finishShape(e) {
    if (this.startLngLat) {
      const s = ei(this.startLngLat, e);
      this.throttledMethods.updateFeaturePosition(s);
    }
    this.featureData && (this.isFeatureGeoJsonValid() ? this.saveFeature() : this.removeTmpFeature()), this.startLngLat = null, this.fireFinishEvent();
  }
  createFeature(e) {
    return this.gm.features.createFeature({
      shapeGeoJson: this.getFeatureGeoJson(e),
      sourceName: ee.temporary
    });
  }
  isFeatureGeoJsonValid() {
    return this.featureData ? jf(this.featureData.getGeoJson()) : !1;
  }
  getFeatureGeoJson(e) {
    return {
      ...Ko(
        [e[0], e[2]],
        [e[2], e[3]]
      ),
      properties: {
        shape: this.shape
      }
    };
  }
  updateFeaturePosition(e) {
    if (!this.featureData)
      return;
    const s = Ko(
      [e[0], e[1]],
      [e[2], e[3]]
    );
    this.featureData.updateGeoJsonGeometry(s.geometry);
    const u = this.getControlMarkerData(["geometry", "coordinates", 4]);
    this.fireUpdateEvent(this.featureData, u);
  }
  getControlMarkerData(e) {
    const s = this.gm.markerPointer.marker;
    return s ? {
      type: "dom",
      instance: s,
      position: {
        coordinate: s.getLngLat(),
        path: e
      }
    } : null;
  }
  fireStartEvent(e, s) {
    const u = {
      level: "system",
      type: "draw",
      mode: this.shape,
      variant: null,
      action: "start",
      featureData: e,
      markerData: s
    };
    this.gm.events.fire(`${pe}:draw`, u);
  }
  fireUpdateEvent(e, s) {
    const u = {
      level: "system",
      type: "draw",
      mode: this.shape,
      variant: null,
      action: "update",
      featureData: e,
      markerData: s
    };
    this.gm.events.fire(`${pe}:draw`, u);
  }
  fireFinishEvent() {
    const e = {
      level: "system",
      type: "draw",
      mode: this.shape,
      variant: null,
      action: "finish"
    };
    this.gm.events.fire(`${pe}:draw`, e);
  }
}
class wk extends Wn {
  constructor() {
    super(...arguments);
    R(this, "mode", "text_marker");
    R(this, "shape", "text_marker");
    R(this, "textarea", null);
    R(this, "mapEventHandlers", {
      click: this.onMouseClick.bind(this),
      mousemove: this.onMouseMove.bind(this)
    });
  }
  onStartAction() {
    this.gm.markerPointer.enable({ invisibleMarker: !0 });
  }
  onEndAction() {
    this.removeTextarea(), this.removeTmpFeature(), this.featureData = null, this.gm.markerPointer.disable(), this.fireMarkerPointerFinishEvent();
  }
  onMouseMove(e) {
    return st(e, { warning: !0 }) ? (this.fireMarkerPointerUpdateEvent(), { next: !0 }) : { next: !0 };
  }
  onMouseClick(e) {
    var s;
    if (!st(e, { warning: !0 }))
      return { next: !0 };
    if (this.textarea)
      this.endShape(), this.gm.markerPointer.enable({ invisibleMarker: !0, lngLat: e.lngLat.toArray() }), this.fireMarkerPointerUpdateEvent();
    else {
      const u = ((s = this.gm.markerPointer.marker) == null ? void 0 : s.getLngLat()) || e.lngLat.toArray();
      this.fireBeforeFeatureCreate({ geoJsonFeatures: [this.getFeatureGeoJson(u)] }), this.flags.featureCreateAllowed && (this.featureData = this.createFeature(u), this.gm.markerPointer.disable(), this.fireMarkerPointerFinishEvent());
    }
    return { next: !1 };
  }
  createFeature(e) {
    const s = this.gm.mapAdapter.project(e);
    return this.createTextarea(s), this.gm.features.createFeature({
      shapeGeoJson: this.getFeatureGeoJson(e),
      sourceName: ee.temporary
    });
  }
  endShape() {
    var s;
    const e = ((s = this.textarea) == null ? void 0 : s.value) || "";
    this.removeTextarea(), e.trim() ? (this.updateFeatureSource(e), this.saveFeature()) : this.removeTmpFeature();
  }
  createTextarea(e) {
    this.textarea = document.createElement("textarea"), this.textarea.style.position = "absolute", this.textarea.style.left = `${e[0]}px`, this.textarea.style.top = `${e[1]}px`, this.textarea.style.opacity = "0.7", this.gm.mapAdapter.getContainer().appendChild(this.textarea), this.textarea.focus();
  }
  removeTextarea() {
    var e;
    (e = this.textarea) == null || e.remove(), this.textarea = null;
  }
  getFeatureGeoJson(e) {
    return {
      type: "Feature",
      properties: {
        shape: this.shape,
        text: ""
      },
      geometry: {
        type: "Point",
        coordinates: e
      }
    };
  }
  updateFeatureSource(e) {
    this.featureData && this.featureData.updateGeoJsonProperties({ shape: this.shape, text: e });
  }
}
const kk = {
  marker: ek,
  circle: V2,
  circle_marker: Y2,
  text_marker: wk,
  line: Q2,
  rectangle: xk,
  polygon: Ek,
  freehand: null,
  custom_shape: null
};
class pl extends ki {
  constructor() {
    super(...arguments);
    R(this, "mode", "drag");
    R(this, "isDragging", !1);
    R(this, "previousLngLat", null);
    R(this, "pointBasedShapes", [
      "marker",
      "circle_marker",
      "text_marker"
    ]);
    R(this, "throttledMethods", Mi({
      onMouseMove: this.onMouseMove
    }, this, this.gm.options.settings.throttlingDelay));
    R(this, "mapEventHandlers", {
      [`${pe}:edit`]: this.handleGmEdit.bind(this),
      mousedown: this.onMouseDown.bind(this),
      touchstart: this.onMouseDown.bind(this),
      mousemove: this.throttledMethods.onMouseMove.bind(this),
      touchmove: this.throttledMethods.onMouseMove.bind(this),
      mouseup: this.onMouseUp.bind(this),
      touchend: this.onMouseUp.bind(this)
    });
    R(this, "getUpdatedGeoJsonHandlers", {
      marker: this.moveSource.bind(this),
      circle: this.moveCircle.bind(this),
      circle_marker: this.moveSource.bind(this),
      text_marker: this.moveSource.bind(this),
      line: this.moveSource.bind(this),
      rectangle: this.moveSource.bind(this),
      polygon: this.moveSource.bind(this)
    });
  }
  onMouseDown(e) {
    var s;
    return this.featureData = this.gm.features.getFeatureByMouseEvent({
      event: e,
      sourceNames: [ee.main]
    }), this.featureData && this.getUpdatedGeoJsonHandlers[this.featureData.shape] ? (this.featureData.changeSource({ sourceName: ee.temporary, atomic: !0 }), this.gm.mapAdapter.setDragPan(!1), this.isDragging = !0, (s = this.snappingHelper) == null || s.addExcludedFeature(this.featureData), this.isPointBasedShape() && this.alignShapeCenterWithControlMarker(this.featureData, e), this.fireFeatureEditStartEvent({ feature: this.featureData, forceMode: "drag" }), { next: !1 }) : { next: !0 };
  }
  onMouseUp() {
    var e;
    return this.featureData ? ((e = this.snappingHelper) == null || e.clearExcludedFeatures(), this.featureData.changeSource({ sourceName: ee.main, atomic: !0 }), this.isDragging = !1, this.previousLngLat = null, this.gm.mapAdapter.setDragPan(!0), this.fireFeatureEditEndEvent({ feature: this.featureData, forceMode: "drag" }), this.featureData = null, { next: !0 }) : { next: !0 };
  }
  onMouseMove(e) {
    var s;
    if (!this.isDragging || !st(e, { warning: !0 }))
      return { next: !0 };
    if (this.featureData) {
      const u = ((s = this.gm.markerPointer.marker) == null ? void 0 : s.getLngLat()) || e.lngLat.toArray();
      this.moveFeature(this.featureData, u);
    }
    return { next: !1 };
  }
  isPointBasedShape() {
    return !!this.featureData && this.pointBasedShapes.includes(this.featureData.shape);
  }
  alignShapeCenterWithControlMarker(e, s) {
    var c;
    const u = $u(e);
    u && ((c = this.gm.markerPointer.marker) == null || c.setLngLat(u), this.onMouseMove(s));
  }
  moveFeature(e, s) {
    if (!this.isDragging)
      return;
    if (!this.previousLngLat) {
      this.previousLngLat = s;
      return;
    }
    const u = this.getUpdatedGeoJsonHandlers[e.shape];
    if (u) {
      const c = u(e, this.previousLngLat, s);
      if (!c) {
        ae.error("BaseDrag.moveFeature: invalid updatedGeoJson", e);
        return;
      }
      this.fireBeforeFeatureUpdate({
        features: [e],
        geoJsonFeatures: [c],
        forceMode: "drag"
      }), this.updateFeatureGeoJson({
        featureData: e,
        featureGeoJson: c,
        forceMode: "drag"
      }) && (this.previousLngLat = s);
    }
  }
  moveSource(e, s, u) {
    const c = Gc(s, u);
    return Mg(e, c);
  }
  moveCircle(e, s, u) {
    if (e.shape !== "circle")
      return ae.error("BaseDrag.moveCircle: invalid shape type", e), null;
    const c = e.getShapeProperty("center");
    if (!c)
      return ae.error("BaseDrag.moveCircle: missing center in the featureData", e), null;
    const f = e.getGeoJson(), h = Gc(s, u), m = $f(f);
    if (!m)
      return ae.error("BaseDrag.moveCircle: missing center circleRimLngLat"), null;
    const d = [
      c[0] + h.lng,
      c[1] + h.lat
    ], y = Vu({
      center: d,
      radius: this.gm.mapAdapter.getDistance(c, m)
    });
    return {
      type: "Feature",
      properties: {
        shape: "circle",
        center: d
      },
      geometry: y.geometry
    };
  }
}
const Sk = (n, r) => (n % r + r) % r, La = (n) => new Intl.NumberFormat("nb-NO", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2
}).format(n), QS = (n) => {
  const e = [
    { range: [0, 1], unit: "cm", factor: 100 },
    { range: [1, 1e4], unit: "m", factor: 1 },
    { range: [1e4, 1 / 0], unit: "km", factor: 1e-3 }
  ].find((s) => n >= s.range[0] && n < s.range[1]);
  return e ? `${La(n * e.factor)} ${e.unit}` : La(n);
}, eM = (n) => {
  const e = [
    { range: [0, 1], unit: "cm²", factor: 1e4 },
    { range: [1, 1e4], unit: "m²", factor: 1 },
    { range: [1e5, 1 / 0], unit: "km²", factor: 1e-6 }
  ].find((s) => n >= s.range[0] && n < s.range[1]);
  return e ? `${La(n * e.factor)} ${e.unit}` : La(n);
};
class Mk extends pl {
  constructor() {
    super(...arguments);
    R(this, "mode", "change");
    R(this, "cutVertexShapeTypes", ["line", "polygon", "rectangle"]);
    R(this, "markerData", null);
    R(this, "shapeUpdateHandlers", {
      marker: this.updateSingleVertex.bind(this),
      circle: this.updateCircle.bind(this),
      circle_marker: this.updateSingleVertex.bind(this),
      text_marker: this.updateSingleVertex.bind(this),
      line: this.updateSingleVertex.bind(this),
      rectangle: this.updateRectangle.bind(this),
      polygon: this.updateSingleVertex.bind(this)
    });
  }
  get snapGuidesInstance() {
    const e = this.gm.actionInstances.helper__snap_guides;
    return vd(e) ? e : null;
  }
  onStartAction() {
  }
  onEndAction() {
    var e;
    (e = this.snapGuidesInstance) == null || e.removeSnapGuides();
  }
  handleGmEdit(e) {
    var s;
    if (!Si(e))
      return { next: !0 };
    if (e.action === "marker_move" && e.lngLatStart && e.markerData) {
      if (e.markerData.type === "vertex")
        return this.moveVertex(e), { next: !1 };
      if (e.lngLatEnd)
        return this.moveSource(
          e.featureData,
          e.lngLatStart,
          e.lngLatEnd
        ), { next: !1 };
    }
    return e.action === "marker_right_click" ? (this.cutVertex(e), this.fireFeatureEditEndEvent({ feature: e.featureData })) : e.action === "edge_marker_click" ? this.insertVertex(e) : e.action === "marker_captured" ? (e.featureData.changeSource({ sourceName: ee.temporary, atomic: !0 }), this.fireFeatureEditStartEvent({ feature: e.featureData })) : e.action === "marker_released" && (this.markerData = null, (s = this.snapGuidesInstance) == null || s.removeSnapGuides(), e.featureData.changeSource({ sourceName: ee.main, atomic: !0 }), this.fireFeatureEditEndEvent({ feature: e.featureData })), { next: !0 };
  }
  moveVertex(e) {
    var f, h, m;
    this.markerData || (this.markerData = e.markerData || null, (f = this.snapGuidesInstance) == null || f.updateSnapGuides(
      e.featureData.getGeoJson(),
      e.lngLatStart
    ));
    const s = e.featureData, u = s.shape, c = ((m = (h = this.shapeUpdateHandlers)[u]) == null ? void 0 : m.call(h, e)) || null;
    c ? (this.fireBeforeFeatureUpdate({
      features: [s],
      geoJsonFeatures: [c]
    }), this.updateFeatureGeoJson({ featureData: s, featureGeoJson: c })) : ae.error("EditChange.moveVertex: invalid geojson", c, e);
  }
  cutVertex(e) {
    const s = e.featureData;
    if (e.markerData.type !== "vertex" || !this.cutVertexShapeTypes.includes(s.shape))
      return;
    let u = !1;
    const c = s.getGeoJson(), f = e.markerData.instance;
    if (ss(c)) {
      if (Eo(c) <= 2) {
        this.gm.features.delete(s);
        return;
      }
    } else if (Yu(c)) {
      if (Eo(c) <= 3) {
        this.gm.features.delete(s);
        return;
      }
    } else if (qu(c) && Eo(c) <= 3) {
      this.gm.features.delete(s);
      return;
    }
    const h = $u(f);
    h && (u = z_(c, h)), u ? (s.convertToPolygon(), s.updateGeoJsonGeometry(c.geometry), this.fireFeatureUpdatedEvent({
      sourceFeatures: [s],
      targetFeatures: [s],
      markerData: e.markerData
    })) : ae.error("EditChange.cutVertex: feature not updated", e);
  }
  insertVertex(e) {
    if (e.markerData.type !== "edge")
      return;
    const s = e.featureData.getGeoJson(), u = e.markerData.segment.end.path, c = u.pop(), f = ci(s, u);
    typeof c == "number" && (f.splice(c, 0, [...e.markerData.position.coordinate]), e.featureData.updateGeoJsonGeometry(s.geometry), e.featureData.convertToPolygon(), this.fireFeatureUpdatedEvent({
      sourceFeatures: [e.featureData],
      targetFeatures: [e.featureData],
      markerData: e.markerData
    }));
  }
  updateSingleVertex({ featureData: e, lngLatEnd: s, markerData: u }) {
    const c = hn(e.getGeoJson()), f = hn(u.position.path), h = f.pop(), m = ci(c, f);
    return Array.isArray(m) && typeof h == "number" ? (m[h] = [...s], h === 0 && e.shape === "polygon" && (m[m.length - 1] = [...s])) : ae.error("BaseDrag.moveSingleVertex: invalid coordinates", c, f), c;
  }
  updateCircle({ featureData: e, lngLatEnd: s }) {
    if (e.shape !== "circle" || e.shapeProperties.center === null)
      return ae.error("BaseDrag.moveCircle: invalid shape type / missing center", e), null;
    const u = e.shapeProperties.center, c = Vu({
      center: u,
      radius: this.gm.mapAdapter.getDistance(u, s)
    });
    return {
      type: "Feature",
      properties: {
        shape: "circle",
        center: u
      },
      geometry: c.geometry
    };
  }
  updateRectangle({ featureData: e, lngLatStart: s, lngLatEnd: u }) {
    const f = e.getGeoJson(), h = f.geometry.coordinates[0], { absCoordIndex: m } = Ya(f, s);
    if (m === -1)
      return ae.error("EditChange.updateRectangle: start vertex not found", e), null;
    const d = Sk(m - 2, 4), y = h[d];
    return Ko(
      u,
      y
    );
  }
}
const _d = (n) => n.length > 0;
function Ik(n, r, {
  ignoreSelfIntersections: e = !0
} = { ignoreSelfIntersections: !0 }) {
  let s = !0;
  return ur(n, (u) => {
    ur(r, (c) => {
      if (s === !1)
        return !1;
      s = bk(
        u.geometry,
        c.geometry,
        e
      );
    });
  }), s;
}
function bk(n, r, e) {
  switch (n.type) {
    case "Point":
      switch (r.type) {
        case "Point":
          return !Ak(n.coordinates, r.coordinates);
        case "LineString":
          return !Uh(r, n);
        case "Polygon":
          return !Cr(n, r);
      }
      break;
    case "LineString":
      switch (r.type) {
        case "Point":
          return !Uh(n, r);
        case "LineString":
          return !Tk(n, r, e);
        case "Polygon":
          return !zh(r, n, e);
      }
      break;
    case "Polygon":
      switch (r.type) {
        case "Point":
          return !Cr(r, n);
        case "LineString":
          return !zh(n, r, e);
        case "Polygon":
          return !Lk(r, n, e);
      }
  }
  return !1;
}
function Uh(n, r) {
  for (let e = 0; e < n.coordinates.length - 1; e++)
    if (Ck(
      n.coordinates[e],
      n.coordinates[e + 1],
      r.coordinates
    ))
      return !0;
  return !1;
}
function Tk(n, r, e) {
  return ks(n, r, {
    ignoreSelfIntersections: e
  }).features.length > 0;
}
function zh(n, r, e) {
  for (const u of r.coordinates)
    if (Cr(u, n))
      return !0;
  return ks(r, Ho(n), {
    ignoreSelfIntersections: e
  }).features.length > 0;
}
function Lk(n, r, e) {
  for (const u of n.coordinates[0])
    if (Cr(u, r))
      return !0;
  for (const u of r.coordinates[0])
    if (Cr(u, n))
      return !0;
  return ks(
    Ho(n),
    Ho(r),
    { ignoreSelfIntersections: e }
  ).features.length > 0;
}
function Ck(n, r, e) {
  const s = e[0] - n[0], u = e[1] - n[1], c = r[0] - n[0], f = r[1] - n[1];
  return s * f - u * c !== 0 ? !1 : Math.abs(c) >= Math.abs(f) ? c > 0 ? n[0] <= e[0] && e[0] <= r[0] : r[0] <= e[0] && e[0] <= n[0] : f > 0 ? n[1] <= e[1] && e[1] <= r[1] : r[1] <= e[1] && e[1] <= n[1];
}
function Ak(n, r) {
  return n[0] === r[0] && n[1] === r[1];
}
function Nk(n, r, {
  ignoreSelfIntersections: e = !0
} = {}) {
  let s = !1;
  return ur(n, (u) => {
    ur(r, (c) => {
      if (s === !0)
        return !0;
      s = !Ik(u.geometry, c.geometry, {
        ignoreSelfIntersections: e
      });
    });
  }), s;
}
var Ed = Nk, Ok = /^-?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i, Uo = Math.ceil, Ht = Math.floor, bt = "[BigNumber Error] ", qh = bt + "Number primitive has more than 15 significant digits: ", rn = 1e14, we = 14, Yh = 9007199254740991, zo = [1, 10, 100, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, 1e13], rr = 1e7, At = 1e9;
function xd(n) {
  var r, e, s, u = M.prototype = { constructor: M, toString: null, valueOf: null }, c = new M(1), f = 20, h = 4, m = -7, d = 21, y = -1e7, _ = 1e7, E = !1, S = 1, I = 0, D = {
    prefix: "",
    groupSize: 3,
    secondaryGroupSize: 0,
    groupSeparator: ",",
    decimalSeparator: ".",
    fractionGroupSize: 0,
    fractionGroupSeparator: " ",
    // non-breaking space
    suffix: ""
  }, q = "0123456789abcdefghijklmnopqrstuvwxyz", G = !0;
  function M(x, k) {
    var T, L, A, F, O, N, P, Y, U = this;
    if (!(U instanceof M)) return new M(x, k);
    if (k == null) {
      if (x && x._isBigNumber === !0) {
        U.s = x.s, !x.c || x.e > _ ? U.c = U.e = null : x.e < y ? U.c = [U.e = 0] : (U.e = x.e, U.c = x.c.slice());
        return;
      }
      if ((N = typeof x == "number") && x * 0 == 0) {
        if (U.s = 1 / x < 0 ? (x = -x, -1) : 1, x === ~~x) {
          for (F = 0, O = x; O >= 10; O /= 10, F++) ;
          F > _ ? U.c = U.e = null : (U.e = F, U.c = [x]);
          return;
        }
        Y = String(x);
      } else {
        if (!Ok.test(Y = String(x))) return s(U, Y, N);
        U.s = Y.charCodeAt(0) == 45 ? (Y = Y.slice(1), -1) : 1;
      }
      (F = Y.indexOf(".")) > -1 && (Y = Y.replace(".", "")), (O = Y.search(/e/i)) > 0 ? (F < 0 && (F = O), F += +Y.slice(O + 1), Y = Y.substring(0, O)) : F < 0 && (F = Y.length);
    } else {
      if (Je(k, 2, q.length, "Base"), k == 10 && G)
        return U = new M(x), j(U, f + U.e + 1, h);
      if (Y = String(x), N = typeof x == "number") {
        if (x * 0 != 0) return s(U, Y, N, k);
        if (U.s = 1 / x < 0 ? (Y = Y.slice(1), -1) : 1, M.DEBUG && Y.replace(/^0\.0*|\./, "").length > 15)
          throw Error(qh + x);
      } else
        U.s = Y.charCodeAt(0) === 45 ? (Y = Y.slice(1), -1) : 1;
      for (T = q.slice(0, k), F = O = 0, P = Y.length; O < P; O++)
        if (T.indexOf(L = Y.charAt(O)) < 0) {
          if (L == ".") {
            if (O > F) {
              F = P;
              continue;
            }
          } else if (!A && (Y == Y.toUpperCase() && (Y = Y.toLowerCase()) || Y == Y.toLowerCase() && (Y = Y.toUpperCase()))) {
            A = !0, O = -1, F = 0;
            continue;
          }
          return s(U, String(x), N, k);
        }
      N = !1, Y = e(Y, k, 10, U.s), (F = Y.indexOf(".")) > -1 ? Y = Y.replace(".", "") : F = Y.length;
    }
    for (O = 0; Y.charCodeAt(O) === 48; O++) ;
    for (P = Y.length; Y.charCodeAt(--P) === 48; ) ;
    if (Y = Y.slice(O, ++P)) {
      if (P -= O, N && M.DEBUG && P > 15 && (x > Yh || x !== Ht(x)))
        throw Error(qh + U.s * x);
      if ((F = F - O - 1) > _)
        U.c = U.e = null;
      else if (F < y)
        U.c = [U.e = 0];
      else {
        if (U.e = F, U.c = [], O = (F + 1) % we, F < 0 && (O += we), O < P) {
          for (O && U.c.push(+Y.slice(0, O)), P -= we; O < P; )
            U.c.push(+Y.slice(O, O += we));
          O = we - (Y = Y.slice(O)).length;
        } else
          O -= P;
        for (; O--; Y += "0") ;
        U.c.push(+Y);
      }
    } else
      U.c = [U.e = 0];
  }
  M.clone = xd, M.ROUND_UP = 0, M.ROUND_DOWN = 1, M.ROUND_CEIL = 2, M.ROUND_FLOOR = 3, M.ROUND_HALF_UP = 4, M.ROUND_HALF_DOWN = 5, M.ROUND_HALF_EVEN = 6, M.ROUND_HALF_CEIL = 7, M.ROUND_HALF_FLOOR = 8, M.EUCLID = 9, M.config = M.set = function(x) {
    var k, T;
    if (x != null)
      if (typeof x == "object") {
        if (x.hasOwnProperty(k = "DECIMAL_PLACES") && (T = x[k], Je(T, 0, At, k), f = T), x.hasOwnProperty(k = "ROUNDING_MODE") && (T = x[k], Je(T, 0, 8, k), h = T), x.hasOwnProperty(k = "EXPONENTIAL_AT") && (T = x[k], T && T.pop ? (Je(T[0], -1e9, 0, k), Je(T[1], 0, At, k), m = T[0], d = T[1]) : (Je(T, -1e9, At, k), m = -(d = T < 0 ? -T : T))), x.hasOwnProperty(k = "RANGE"))
          if (T = x[k], T && T.pop)
            Je(T[0], -1e9, -1, k), Je(T[1], 1, At, k), y = T[0], _ = T[1];
          else if (Je(T, -1e9, At, k), T)
            y = -(_ = T < 0 ? -T : T);
          else
            throw Error(bt + k + " cannot be zero: " + T);
        if (x.hasOwnProperty(k = "CRYPTO"))
          if (T = x[k], T === !!T)
            if (T)
              if (typeof crypto < "u" && crypto && (crypto.getRandomValues || crypto.randomBytes))
                E = T;
              else
                throw E = !T, Error(bt + "crypto unavailable");
            else
              E = T;
          else
            throw Error(bt + k + " not true or false: " + T);
        if (x.hasOwnProperty(k = "MODULO_MODE") && (T = x[k], Je(T, 0, 9, k), S = T), x.hasOwnProperty(k = "POW_PRECISION") && (T = x[k], Je(T, 0, At, k), I = T), x.hasOwnProperty(k = "FORMAT"))
          if (T = x[k], typeof T == "object") D = T;
          else throw Error(bt + k + " not an object: " + T);
        if (x.hasOwnProperty(k = "ALPHABET"))
          if (T = x[k], typeof T == "string" && !/^.?$|[+\-.\s]|(.).*\1/.test(T))
            G = T.slice(0, 10) == "0123456789", q = T;
          else
            throw Error(bt + k + " invalid: " + T);
      } else
        throw Error(bt + "Object expected: " + x);
    return {
      DECIMAL_PLACES: f,
      ROUNDING_MODE: h,
      EXPONENTIAL_AT: [m, d],
      RANGE: [y, _],
      CRYPTO: E,
      MODULO_MODE: S,
      POW_PRECISION: I,
      FORMAT: D,
      ALPHABET: q
    };
  }, M.isBigNumber = function(x) {
    if (!x || x._isBigNumber !== !0) return !1;
    if (!M.DEBUG) return !0;
    var k, T, L = x.c, A = x.e, F = x.s;
    e: if ({}.toString.call(L) == "[object Array]") {
      if ((F === 1 || F === -1) && A >= -1e9 && A <= At && A === Ht(A)) {
        if (L[0] === 0) {
          if (A === 0 && L.length === 1) return !0;
          break e;
        }
        if (k = (A + 1) % we, k < 1 && (k += we), String(L[0]).length == k) {
          for (k = 0; k < L.length; k++)
            if (T = L[k], T < 0 || T >= rn || T !== Ht(T)) break e;
          if (T !== 0) return !0;
        }
      }
    } else if (L === null && A === null && (F === null || F === 1 || F === -1))
      return !0;
    throw Error(bt + "Invalid BigNumber: " + x);
  }, M.maximum = M.max = function() {
    return V(arguments, -1);
  }, M.minimum = M.min = function() {
    return V(arguments, 1);
  }, M.random = function() {
    var x = 9007199254740992, k = Math.random() * x & 2097151 ? function() {
      return Ht(Math.random() * x);
    } : function() {
      return (Math.random() * 1073741824 | 0) * 8388608 + (Math.random() * 8388608 | 0);
    };
    return function(T) {
      var L, A, F, O, N, P = 0, Y = [], U = new M(c);
      if (T == null ? T = f : Je(T, 0, At), O = Uo(T / we), E)
        if (crypto.getRandomValues) {
          for (L = crypto.getRandomValues(new Uint32Array(O *= 2)); P < O; )
            N = L[P] * 131072 + (L[P + 1] >>> 11), N >= 9e15 ? (A = crypto.getRandomValues(new Uint32Array(2)), L[P] = A[0], L[P + 1] = A[1]) : (Y.push(N % 1e14), P += 2);
          P = O / 2;
        } else if (crypto.randomBytes) {
          for (L = crypto.randomBytes(O *= 7); P < O; )
            N = (L[P] & 31) * 281474976710656 + L[P + 1] * 1099511627776 + L[P + 2] * 4294967296 + L[P + 3] * 16777216 + (L[P + 4] << 16) + (L[P + 5] << 8) + L[P + 6], N >= 9e15 ? crypto.randomBytes(7).copy(L, P) : (Y.push(N % 1e14), P += 7);
          P = O / 7;
        } else
          throw E = !1, Error(bt + "crypto unavailable");
      if (!E)
        for (; P < O; )
          N = k(), N < 9e15 && (Y[P++] = N % 1e14);
      for (O = Y[--P], T %= we, O && T && (N = zo[we - T], Y[P] = Ht(O / N) * N); Y[P] === 0; Y.pop(), P--) ;
      if (P < 0)
        Y = [F = 0];
      else {
        for (F = -1; Y[0] === 0; Y.splice(0, 1), F -= we) ;
        for (P = 1, N = Y[0]; N >= 10; N /= 10, P++) ;
        P < we && (F -= we - P);
      }
      return U.e = F, U.c = Y, U;
    };
  }(), M.sum = function() {
    for (var x = 1, k = arguments, T = new M(k[0]); x < k.length; ) T = T.plus(k[x++]);
    return T;
  }, e = /* @__PURE__ */ function() {
    var x = "0123456789";
    function k(T, L, A, F) {
      for (var O, N = [0], P, Y = 0, U = T.length; Y < U; ) {
        for (P = N.length; P--; N[P] *= L) ;
        for (N[0] += F.indexOf(T.charAt(Y++)), O = 0; O < N.length; O++)
          N[O] > A - 1 && (N[O + 1] == null && (N[O + 1] = 0), N[O + 1] += N[O] / A | 0, N[O] %= A);
      }
      return N.reverse();
    }
    return function(T, L, A, F, O) {
      var N, P, Y, U, Z, K, re, de, ce = T.indexOf("."), se = f, ue = h;
      for (ce >= 0 && (U = I, I = 0, T = T.replace(".", ""), de = new M(L), K = de.pow(T.length - ce), I = U, de.c = k(
        Gn(Yt(K.c), K.e, "0"),
        10,
        A,
        x
      ), de.e = de.c.length), re = k(T, L, A, O ? (N = q, x) : (N = x, q)), Y = U = re.length; re[--U] == 0; re.pop()) ;
      if (!re[0]) return N.charAt(0);
      if (ce < 0 ? --Y : (K.c = re, K.e = Y, K.s = F, K = r(K, de, se, ue, A), re = K.c, Z = K.r, Y = K.e), P = Y + se + 1, ce = re[P], U = A / 2, Z = Z || P < 0 || re[P + 1] != null, Z = ue < 4 ? (ce != null || Z) && (ue == 0 || ue == (K.s < 0 ? 3 : 2)) : ce > U || ce == U && (ue == 4 || Z || ue == 6 && re[P - 1] & 1 || ue == (K.s < 0 ? 8 : 7)), P < 1 || !re[0])
        T = Z ? Gn(N.charAt(1), -se, N.charAt(0)) : N.charAt(0);
      else {
        if (re.length = P, Z)
          for (--A; ++re[--P] > A; )
            re[P] = 0, P || (++Y, re = [1].concat(re));
        for (U = re.length; !re[--U]; ) ;
        for (ce = 0, T = ""; ce <= U; T += N.charAt(re[ce++])) ;
        T = Gn(T, Y, N.charAt(0));
      }
      return T;
    };
  }(), r = /* @__PURE__ */ function() {
    function x(L, A, F) {
      var O, N, P, Y, U = 0, Z = L.length, K = A % rr, re = A / rr | 0;
      for (L = L.slice(); Z--; )
        P = L[Z] % rr, Y = L[Z] / rr | 0, O = re * P + Y * K, N = K * P + O % rr * rr + U, U = (N / F | 0) + (O / rr | 0) + re * Y, L[Z] = N % F;
      return U && (L = [U].concat(L)), L;
    }
    function k(L, A, F, O) {
      var N, P;
      if (F != O)
        P = F > O ? 1 : -1;
      else
        for (N = P = 0; N < F; N++)
          if (L[N] != A[N]) {
            P = L[N] > A[N] ? 1 : -1;
            break;
          }
      return P;
    }
    function T(L, A, F, O) {
      for (var N = 0; F--; )
        L[F] -= N, N = L[F] < A[F] ? 1 : 0, L[F] = N * O + L[F] - A[F];
      for (; !L[0] && L.length > 1; L.splice(0, 1)) ;
    }
    return function(L, A, F, O, N) {
      var P, Y, U, Z, K, re, de, ce, se, ue, xe, Le, J, Kt, be, he, C, Pe = L.s == A.s ? 1 : -1, Oe = L.c, Se = A.c;
      if (!Oe || !Oe[0] || !Se || !Se[0])
        return new M(
          // Return NaN if either NaN, or both Infinity or 0.
          !L.s || !A.s || (Oe ? Se && Oe[0] == Se[0] : !Se) ? NaN : (
            // Return ±0 if x is ±0 or y is ±Infinity, or return ±Infinity as y is ±0.
            Oe && Oe[0] == 0 || !Se ? Pe * 0 : Pe / 0
          )
        );
      for (ce = new M(Pe), se = ce.c = [], Y = L.e - A.e, Pe = F + Y + 1, N || (N = rn, Y = Jt(L.e / we) - Jt(A.e / we), Pe = Pe / we | 0), U = 0; Se[U] == (Oe[U] || 0); U++) ;
      if (Se[U] > (Oe[U] || 0) && Y--, Pe < 0)
        se.push(1), Z = !0;
      else {
        for (Kt = Oe.length, he = Se.length, U = 0, Pe += 2, K = Ht(N / (Se[0] + 1)), K > 1 && (Se = x(Se, K, N), Oe = x(Oe, K, N), he = Se.length, Kt = Oe.length), J = he, ue = Oe.slice(0, he), xe = ue.length; xe < he; ue[xe++] = 0) ;
        C = Se.slice(), C = [0].concat(C), be = Se[0], Se[1] >= N / 2 && be++;
        do {
          if (K = 0, P = k(Se, ue, he, xe), P < 0) {
            if (Le = ue[0], he != xe && (Le = Le * N + (ue[1] || 0)), K = Ht(Le / be), K > 1)
              for (K >= N && (K = N - 1), re = x(Se, K, N), de = re.length, xe = ue.length; k(re, ue, de, xe) == 1; )
                K--, T(re, he < de ? C : Se, de, N), de = re.length, P = 1;
            else
              K == 0 && (P = K = 1), re = Se.slice(), de = re.length;
            if (de < xe && (re = [0].concat(re)), T(ue, re, xe, N), xe = ue.length, P == -1)
              for (; k(Se, ue, he, xe) < 1; )
                K++, T(ue, he < xe ? C : Se, xe, N), xe = ue.length;
          } else P === 0 && (K++, ue = [0]);
          se[U++] = K, ue[0] ? ue[xe++] = Oe[J] || 0 : (ue = [Oe[J]], xe = 1);
        } while ((J++ < Kt || ue[0] != null) && Pe--);
        Z = ue[0] != null, se[0] || se.splice(0, 1);
      }
      if (N == rn) {
        for (U = 1, Pe = se[0]; Pe >= 10; Pe /= 10, U++) ;
        j(ce, F + (ce.e = U + Y * we - 1) + 1, O, Z);
      } else
        ce.e = Y, ce.r = +Z;
      return ce;
    };
  }();
  function H(x, k, T, L) {
    var A, F, O, N, P;
    if (T == null ? T = h : Je(T, 0, 8), !x.c) return x.toString();
    if (A = x.c[0], O = x.e, k == null)
      P = Yt(x.c), P = L == 1 || L == 2 && (O <= m || O >= d) ? Zs(P, O) : Gn(P, O, "0");
    else if (x = j(new M(x), k, T), F = x.e, P = Yt(x.c), N = P.length, L == 1 || L == 2 && (k <= F || F <= m)) {
      for (; N < k; P += "0", N++) ;
      P = Zs(P, F);
    } else if (k -= O, P = Gn(P, F, "0"), F + 1 > N) {
      if (--k > 0) for (P += "."; k--; P += "0") ;
    } else if (k += F - N, k > 0)
      for (F + 1 == N && (P += "."); k--; P += "0") ;
    return x.s < 0 && A ? "-" + P : P;
  }
  function V(x, k) {
    for (var T, L, A = 1, F = new M(x[0]); A < x.length; A++)
      L = new M(x[A]), (!L.s || (T = xr(F, L)) === k || T === 0 && F.s === k) && (F = L);
    return F;
  }
  function X(x, k, T) {
    for (var L = 1, A = k.length; !k[--A]; k.pop()) ;
    for (A = k[0]; A >= 10; A /= 10, L++) ;
    return (T = L + T * we - 1) > _ ? x.c = x.e = null : T < y ? x.c = [x.e = 0] : (x.e = T, x.c = k), x;
  }
  s = /* @__PURE__ */ function() {
    var x = /^(-?)0([xbo])(?=\w[\w.]*$)/i, k = /^([^.]+)\.$/, T = /^\.([^.]+)$/, L = /^-?(Infinity|NaN)$/, A = /^\s*\+(?=[\w.])|^\s+|\s+$/g;
    return function(F, O, N, P) {
      var Y, U = N ? O : O.replace(A, "");
      if (L.test(U))
        F.s = isNaN(U) ? null : U < 0 ? -1 : 1;
      else {
        if (!N && (U = U.replace(x, function(Z, K, re) {
          return Y = (re = re.toLowerCase()) == "x" ? 16 : re == "b" ? 2 : 8, !P || P == Y ? K : Z;
        }), P && (Y = P, U = U.replace(k, "$1").replace(T, "0.$1")), O != U))
          return new M(U, Y);
        if (M.DEBUG)
          throw Error(bt + "Not a" + (P ? " base " + P : "") + " number: " + O);
        F.s = null;
      }
      F.c = F.e = null;
    };
  }();
  function j(x, k, T, L) {
    var A, F, O, N, P, Y, U, Z = x.c, K = zo;
    if (Z) {
      e: {
        for (A = 1, N = Z[0]; N >= 10; N /= 10, A++) ;
        if (F = k - A, F < 0)
          F += we, O = k, P = Z[Y = 0], U = Ht(P / K[A - O - 1] % 10);
        else if (Y = Uo((F + 1) / we), Y >= Z.length)
          if (L) {
            for (; Z.length <= Y; Z.push(0)) ;
            P = U = 0, A = 1, F %= we, O = F - we + 1;
          } else
            break e;
        else {
          for (P = N = Z[Y], A = 1; N >= 10; N /= 10, A++) ;
          F %= we, O = F - we + A, U = O < 0 ? 0 : Ht(P / K[A - O - 1] % 10);
        }
        if (L = L || k < 0 || // Are there any non-zero digits after the rounding digit?
        // The expression  n % pows10[d - j - 1]  returns all digits of n to the right
        // of the digit at j, e.g. if n is 908714 and j is 2, the expression gives 714.
        Z[Y + 1] != null || (O < 0 ? P : P % K[A - O - 1]), L = T < 4 ? (U || L) && (T == 0 || T == (x.s < 0 ? 3 : 2)) : U > 5 || U == 5 && (T == 4 || L || T == 6 && // Check whether the digit to the left of the rounding digit is odd.
        (F > 0 ? O > 0 ? P / K[A - O] : 0 : Z[Y - 1]) % 10 & 1 || T == (x.s < 0 ? 8 : 7)), k < 1 || !Z[0])
          return Z.length = 0, L ? (k -= x.e + 1, Z[0] = K[(we - k % we) % we], x.e = -k || 0) : Z[0] = x.e = 0, x;
        if (F == 0 ? (Z.length = Y, N = 1, Y--) : (Z.length = Y + 1, N = K[we - F], Z[Y] = O > 0 ? Ht(P / K[A - O] % K[O]) * N : 0), L)
          for (; ; )
            if (Y == 0) {
              for (F = 1, O = Z[0]; O >= 10; O /= 10, F++) ;
              for (O = Z[0] += N, N = 1; O >= 10; O /= 10, N++) ;
              F != N && (x.e++, Z[0] == rn && (Z[0] = 1));
              break;
            } else {
              if (Z[Y] += N, Z[Y] != rn) break;
              Z[Y--] = 0, N = 1;
            }
        for (F = Z.length; Z[--F] === 0; Z.pop()) ;
      }
      x.e > _ ? x.c = x.e = null : x.e < y && (x.c = [x.e = 0]);
    }
    return x;
  }
  function $(x) {
    var k, T = x.e;
    return T === null ? x.toString() : (k = Yt(x.c), k = T <= m || T >= d ? Zs(k, T) : Gn(k, T, "0"), x.s < 0 ? "-" + k : k);
  }
  return u.absoluteValue = u.abs = function() {
    var x = new M(this);
    return x.s < 0 && (x.s = 1), x;
  }, u.comparedTo = function(x, k) {
    return xr(this, new M(x, k));
  }, u.decimalPlaces = u.dp = function(x, k) {
    var T, L, A, F = this;
    if (x != null)
      return Je(x, 0, At), k == null ? k = h : Je(k, 0, 8), j(new M(F), x + F.e + 1, k);
    if (!(T = F.c)) return null;
    if (L = ((A = T.length - 1) - Jt(this.e / we)) * we, A = T[A]) for (; A % 10 == 0; A /= 10, L--) ;
    return L < 0 && (L = 0), L;
  }, u.dividedBy = u.div = function(x, k) {
    return r(this, new M(x, k), f, h);
  }, u.dividedToIntegerBy = u.idiv = function(x, k) {
    return r(this, new M(x, k), 0, 1);
  }, u.exponentiatedBy = u.pow = function(x, k) {
    var T, L, A, F, O, N, P, Y, U, Z = this;
    if (x = new M(x), x.c && !x.isInteger())
      throw Error(bt + "Exponent not an integer: " + $(x));
    if (k != null && (k = new M(k)), N = x.e > 14, !Z.c || !Z.c[0] || Z.c[0] == 1 && !Z.e && Z.c.length == 1 || !x.c || !x.c[0])
      return U = new M(Math.pow(+$(Z), N ? x.s * (2 - Ws(x)) : +$(x))), k ? U.mod(k) : U;
    if (P = x.s < 0, k) {
      if (k.c ? !k.c[0] : !k.s) return new M(NaN);
      L = !P && Z.isInteger() && k.isInteger(), L && (Z = Z.mod(k));
    } else {
      if (x.e > 9 && (Z.e > 0 || Z.e < -1 || (Z.e == 0 ? Z.c[0] > 1 || N && Z.c[1] >= 24e7 : Z.c[0] < 8e13 || N && Z.c[0] <= 9999975e7)))
        return F = Z.s < 0 && Ws(x) ? -0 : 0, Z.e > -1 && (F = 1 / F), new M(P ? 1 / F : F);
      I && (F = Uo(I / we + 2));
    }
    for (N ? (T = new M(0.5), P && (x.s = 1), Y = Ws(x)) : (A = Math.abs(+$(x)), Y = A % 2), U = new M(c); ; ) {
      if (Y) {
        if (U = U.times(Z), !U.c) break;
        F ? U.c.length > F && (U.c.length = F) : L && (U = U.mod(k));
      }
      if (A) {
        if (A = Ht(A / 2), A === 0) break;
        Y = A % 2;
      } else if (x = x.times(T), j(x, x.e + 1, 1), x.e > 14)
        Y = Ws(x);
      else {
        if (A = +$(x), A === 0) break;
        Y = A % 2;
      }
      Z = Z.times(Z), F ? Z.c && Z.c.length > F && (Z.c.length = F) : L && (Z = Z.mod(k));
    }
    return L ? U : (P && (U = c.div(U)), k ? U.mod(k) : F ? j(U, I, h, O) : U);
  }, u.integerValue = function(x) {
    var k = new M(this);
    return x == null ? x = h : Je(x, 0, 8), j(k, k.e + 1, x);
  }, u.isEqualTo = u.eq = function(x, k) {
    return xr(this, new M(x, k)) === 0;
  }, u.isFinite = function() {
    return !!this.c;
  }, u.isGreaterThan = u.gt = function(x, k) {
    return xr(this, new M(x, k)) > 0;
  }, u.isGreaterThanOrEqualTo = u.gte = function(x, k) {
    return (k = xr(this, new M(x, k))) === 1 || k === 0;
  }, u.isInteger = function() {
    return !!this.c && Jt(this.e / we) > this.c.length - 2;
  }, u.isLessThan = u.lt = function(x, k) {
    return xr(this, new M(x, k)) < 0;
  }, u.isLessThanOrEqualTo = u.lte = function(x, k) {
    return (k = xr(this, new M(x, k))) === -1 || k === 0;
  }, u.isNaN = function() {
    return !this.s;
  }, u.isNegative = function() {
    return this.s < 0;
  }, u.isPositive = function() {
    return this.s > 0;
  }, u.isZero = function() {
    return !!this.c && this.c[0] == 0;
  }, u.minus = function(x, k) {
    var T, L, A, F, O = this, N = O.s;
    if (x = new M(x, k), k = x.s, !N || !k) return new M(NaN);
    if (N != k)
      return x.s = -k, O.plus(x);
    var P = O.e / we, Y = x.e / we, U = O.c, Z = x.c;
    if (!P || !Y) {
      if (!U || !Z) return U ? (x.s = -k, x) : new M(Z ? O : NaN);
      if (!U[0] || !Z[0])
        return Z[0] ? (x.s = -k, x) : new M(U[0] ? O : (
          // IEEE 754 (2008) 6.3: n - n = -0 when rounding to -Infinity
          h == 3 ? -0 : 0
        ));
    }
    if (P = Jt(P), Y = Jt(Y), U = U.slice(), N = P - Y) {
      for ((F = N < 0) ? (N = -N, A = U) : (Y = P, A = Z), A.reverse(), k = N; k--; A.push(0)) ;
      A.reverse();
    } else
      for (L = (F = (N = U.length) < (k = Z.length)) ? N : k, N = k = 0; k < L; k++)
        if (U[k] != Z[k]) {
          F = U[k] < Z[k];
          break;
        }
    if (F && (A = U, U = Z, Z = A, x.s = -x.s), k = (L = Z.length) - (T = U.length), k > 0) for (; k--; U[T++] = 0) ;
    for (k = rn - 1; L > N; ) {
      if (U[--L] < Z[L]) {
        for (T = L; T && !U[--T]; U[T] = k) ;
        --U[T], U[L] += rn;
      }
      U[L] -= Z[L];
    }
    for (; U[0] == 0; U.splice(0, 1), --Y) ;
    return U[0] ? X(x, U, Y) : (x.s = h == 3 ? -1 : 1, x.c = [x.e = 0], x);
  }, u.modulo = u.mod = function(x, k) {
    var T, L, A = this;
    return x = new M(x, k), !A.c || !x.s || x.c && !x.c[0] ? new M(NaN) : !x.c || A.c && !A.c[0] ? new M(A) : (S == 9 ? (L = x.s, x.s = 1, T = r(A, x, 0, 3), x.s = L, T.s *= L) : T = r(A, x, 0, S), x = A.minus(T.times(x)), !x.c[0] && S == 1 && (x.s = A.s), x);
  }, u.multipliedBy = u.times = function(x, k) {
    var T, L, A, F, O, N, P, Y, U, Z, K, re, de, ce, se, ue = this, xe = ue.c, Le = (x = new M(x, k)).c;
    if (!xe || !Le || !xe[0] || !Le[0])
      return !ue.s || !x.s || xe && !xe[0] && !Le || Le && !Le[0] && !xe ? x.c = x.e = x.s = null : (x.s *= ue.s, !xe || !Le ? x.c = x.e = null : (x.c = [0], x.e = 0)), x;
    for (L = Jt(ue.e / we) + Jt(x.e / we), x.s *= ue.s, P = xe.length, Z = Le.length, P < Z && (de = xe, xe = Le, Le = de, A = P, P = Z, Z = A), A = P + Z, de = []; A--; de.push(0)) ;
    for (ce = rn, se = rr, A = Z; --A >= 0; ) {
      for (T = 0, K = Le[A] % se, re = Le[A] / se | 0, O = P, F = A + O; F > A; )
        Y = xe[--O] % se, U = xe[O] / se | 0, N = re * Y + U * K, Y = K * Y + N % se * se + de[F] + T, T = (Y / ce | 0) + (N / se | 0) + re * U, de[F--] = Y % ce;
      de[F] = T;
    }
    return T ? ++L : de.splice(0, 1), X(x, de, L);
  }, u.negated = function() {
    var x = new M(this);
    return x.s = -x.s || null, x;
  }, u.plus = function(x, k) {
    var T, L = this, A = L.s;
    if (x = new M(x, k), k = x.s, !A || !k) return new M(NaN);
    if (A != k)
      return x.s = -k, L.minus(x);
    var F = L.e / we, O = x.e / we, N = L.c, P = x.c;
    if (!F || !O) {
      if (!N || !P) return new M(A / 0);
      if (!N[0] || !P[0]) return P[0] ? x : new M(N[0] ? L : A * 0);
    }
    if (F = Jt(F), O = Jt(O), N = N.slice(), A = F - O) {
      for (A > 0 ? (O = F, T = P) : (A = -A, T = N), T.reverse(); A--; T.push(0)) ;
      T.reverse();
    }
    for (A = N.length, k = P.length, A - k < 0 && (T = P, P = N, N = T, k = A), A = 0; k; )
      A = (N[--k] = N[k] + P[k] + A) / rn | 0, N[k] = rn === N[k] ? 0 : N[k] % rn;
    return A && (N = [A].concat(N), ++O), X(x, N, O);
  }, u.precision = u.sd = function(x, k) {
    var T, L, A, F = this;
    if (x != null && x !== !!x)
      return Je(x, 1, At), k == null ? k = h : Je(k, 0, 8), j(new M(F), x, k);
    if (!(T = F.c)) return null;
    if (A = T.length - 1, L = A * we + 1, A = T[A]) {
      for (; A % 10 == 0; A /= 10, L--) ;
      for (A = T[0]; A >= 10; A /= 10, L++) ;
    }
    return x && F.e + 1 > L && (L = F.e + 1), L;
  }, u.shiftedBy = function(x) {
    return Je(x, -9007199254740991, Yh), this.times("1e" + x);
  }, u.squareRoot = u.sqrt = function() {
    var x, k, T, L, A, F = this, O = F.c, N = F.s, P = F.e, Y = f + 4, U = new M("0.5");
    if (N !== 1 || !O || !O[0])
      return new M(!N || N < 0 && (!O || O[0]) ? NaN : O ? F : 1 / 0);
    if (N = Math.sqrt(+$(F)), N == 0 || N == 1 / 0 ? (k = Yt(O), (k.length + P) % 2 == 0 && (k += "0"), N = Math.sqrt(+k), P = Jt((P + 1) / 2) - (P < 0 || P % 2), N == 1 / 0 ? k = "5e" + P : (k = N.toExponential(), k = k.slice(0, k.indexOf("e") + 1) + P), T = new M(k)) : T = new M(N + ""), T.c[0]) {
      for (P = T.e, N = P + Y, N < 3 && (N = 0); ; )
        if (A = T, T = U.times(A.plus(r(F, A, Y, 1))), Yt(A.c).slice(0, N) === (k = Yt(T.c)).slice(0, N))
          if (T.e < P && --N, k = k.slice(N - 3, N + 1), k == "9999" || !L && k == "4999") {
            if (!L && (j(A, A.e + f + 2, 0), A.times(A).eq(F))) {
              T = A;
              break;
            }
            Y += 4, N += 4, L = 1;
          } else {
            (!+k || !+k.slice(1) && k.charAt(0) == "5") && (j(T, T.e + f + 2, 1), x = !T.times(T).eq(F));
            break;
          }
    }
    return j(T, T.e + f + 1, h, x);
  }, u.toExponential = function(x, k) {
    return x != null && (Je(x, 0, At), x++), H(this, x, k, 1);
  }, u.toFixed = function(x, k) {
    return x != null && (Je(x, 0, At), x = x + this.e + 1), H(this, x, k);
  }, u.toFormat = function(x, k, T) {
    var L, A = this;
    if (T == null)
      x != null && k && typeof k == "object" ? (T = k, k = null) : x && typeof x == "object" ? (T = x, x = k = null) : T = D;
    else if (typeof T != "object")
      throw Error(bt + "Argument not an object: " + T);
    if (L = A.toFixed(x, k), A.c) {
      var F, O = L.split("."), N = +T.groupSize, P = +T.secondaryGroupSize, Y = T.groupSeparator || "", U = O[0], Z = O[1], K = A.s < 0, re = K ? U.slice(1) : U, de = re.length;
      if (P && (F = N, N = P, P = F, de -= F), N > 0 && de > 0) {
        for (F = de % N || N, U = re.substr(0, F); F < de; F += N) U += Y + re.substr(F, N);
        P > 0 && (U += Y + re.slice(F)), K && (U = "-" + U);
      }
      L = Z ? U + (T.decimalSeparator || "") + ((P = +T.fractionGroupSize) ? Z.replace(
        new RegExp("\\d{" + P + "}\\B", "g"),
        "$&" + (T.fractionGroupSeparator || "")
      ) : Z) : U;
    }
    return (T.prefix || "") + L + (T.suffix || "");
  }, u.toFraction = function(x) {
    var k, T, L, A, F, O, N, P, Y, U, Z, K, re = this, de = re.c;
    if (x != null && (N = new M(x), !N.isInteger() && (N.c || N.s !== 1) || N.lt(c)))
      throw Error(bt + "Argument " + (N.isInteger() ? "out of range: " : "not an integer: ") + $(N));
    if (!de) return new M(re);
    for (k = new M(c), Y = T = new M(c), L = P = new M(c), K = Yt(de), F = k.e = K.length - re.e - 1, k.c[0] = zo[(O = F % we) < 0 ? we + O : O], x = !x || N.comparedTo(k) > 0 ? F > 0 ? k : Y : N, O = _, _ = 1 / 0, N = new M(K), P.c[0] = 0; U = r(N, k, 0, 1), A = T.plus(U.times(L)), A.comparedTo(x) != 1; )
      T = L, L = A, Y = P.plus(U.times(A = Y)), P = A, k = N.minus(U.times(A = k)), N = A;
    return A = r(x.minus(T), L, 0, 1), P = P.plus(A.times(Y)), T = T.plus(A.times(L)), P.s = Y.s = re.s, F = F * 2, Z = r(Y, L, F, h).minus(re).abs().comparedTo(
      r(P, T, F, h).minus(re).abs()
    ) < 1 ? [Y, L] : [P, T], _ = O, Z;
  }, u.toNumber = function() {
    return +$(this);
  }, u.toPrecision = function(x, k) {
    return x != null && Je(x, 1, At), H(this, x, k, 2);
  }, u.toString = function(x) {
    var k, T = this, L = T.s, A = T.e;
    return A === null ? L ? (k = "Infinity", L < 0 && (k = "-" + k)) : k = "NaN" : (x == null ? k = A <= m || A >= d ? Zs(Yt(T.c), A) : Gn(Yt(T.c), A, "0") : x === 10 && G ? (T = j(new M(T), f + A + 1, h), k = Gn(Yt(T.c), T.e, "0")) : (Je(x, 2, q.length, "Base"), k = e(Gn(Yt(T.c), A, "0"), 10, x, L, !0)), L < 0 && T.c[0] && (k = "-" + k)), k;
  }, u.valueOf = u.toJSON = function() {
    return $(this);
  }, u._isBigNumber = !0, u[Symbol.toStringTag] = "BigNumber", u[Symbol.for("nodejs.util.inspect.custom")] = u.valueOf, n != null && M.set(n), M;
}
function Jt(n) {
  var r = n | 0;
  return n > 0 || n === r ? r : r - 1;
}
function Yt(n) {
  for (var r, e, s = 1, u = n.length, c = n[0] + ""; s < u; ) {
    for (r = n[s++] + "", e = we - r.length; e--; r = "0" + r) ;
    c += r;
  }
  for (u = c.length; c.charCodeAt(--u) === 48; ) ;
  return c.slice(0, u + 1 || 1);
}
function xr(n, r) {
  var e, s, u = n.c, c = r.c, f = n.s, h = r.s, m = n.e, d = r.e;
  if (!f || !h) return null;
  if (e = u && !u[0], s = c && !c[0], e || s) return e ? s ? 0 : -h : f;
  if (f != h) return f;
  if (e = f < 0, s = m == d, !u || !c) return s ? 0 : !u ^ e ? 1 : -1;
  if (!s) return m > d ^ e ? 1 : -1;
  for (h = (m = u.length) < (d = c.length) ? m : d, f = 0; f < h; f++) if (u[f] != c[f]) return u[f] > c[f] ^ e ? 1 : -1;
  return m == d ? 0 : m > d ^ e ? 1 : -1;
}
function Je(n, r, e, s) {
  if (n < r || n > e || n !== Ht(n))
    throw Error(bt + (s || "Argument") + (typeof n == "number" ? n < r || n > e ? " out of range: " : " not an integer: " : " not a primitive number: ") + String(n));
}
function Ws(n) {
  var r = n.c.length - 1;
  return Jt(n.e / we) == r && n.c[r] % 2 != 0;
}
function Zs(n, r) {
  return (n.length > 1 ? n.charAt(0) + "." + n.slice(1) : n) + (r < 0 ? "e" : "e+") + r;
}
function Gn(n, r, e) {
  var s, u;
  if (r < 0) {
    for (u = e + "."; ++r; u += e) ;
    n = u + n;
  } else if (s = n.length, ++r > s) {
    for (u = e, r -= s; --r; u += e) ;
    n += u;
  } else r < s && (n = n.slice(0, r) + "." + n.slice(r));
  return n;
}
var In = xd(), Pk = class {
  constructor(n) {
    R(this, "key");
    R(this, "left", null);
    R(this, "right", null);
    this.key = n;
  }
}, Wi = class extends Pk {
  constructor(n) {
    super(n);
  }
}, Rk = class {
  constructor() {
    R(this, "size", 0);
    R(this, "modificationCount", 0);
    R(this, "splayCount", 0);
  }
  splay(n) {
    const r = this.root;
    if (r == null)
      return this.compare(n, n), -1;
    let e = null, s = null, u = null, c = null, f = r;
    const h = this.compare;
    let m;
    for (; ; )
      if (m = h(f.key, n), m > 0) {
        let d = f.left;
        if (d == null || (m = h(d.key, n), m > 0 && (f.left = d.right, d.right = f, f = d, d = f.left, d == null)))
          break;
        e == null ? s = f : e.left = f, e = f, f = d;
      } else if (m < 0) {
        let d = f.right;
        if (d == null || (m = h(d.key, n), m < 0 && (f.right = d.left, d.left = f, f = d, d = f.right, d == null)))
          break;
        u == null ? c = f : u.right = f, u = f, f = d;
      } else
        break;
    return u != null && (u.right = f.left, f.left = c), e != null && (e.left = f.right, f.right = s), this.root !== f && (this.root = f, this.splayCount++), m;
  }
  splayMin(n) {
    let r = n, e = r.left;
    for (; e != null; ) {
      const s = e;
      r.left = s.right, s.right = r, r = s, e = r.left;
    }
    return r;
  }
  splayMax(n) {
    let r = n, e = r.right;
    for (; e != null; ) {
      const s = e;
      r.right = s.left, s.left = r, r = s, e = r.right;
    }
    return r;
  }
  _delete(n) {
    if (this.root == null || this.splay(n) != 0) return null;
    let e = this.root;
    const s = e, u = e.left;
    if (this.size--, u == null)
      this.root = e.right;
    else {
      const c = e.right;
      e = this.splayMax(u), e.right = c, this.root = e;
    }
    return this.modificationCount++, s;
  }
  addNewRoot(n, r) {
    this.size++, this.modificationCount++;
    const e = this.root;
    if (e == null) {
      this.root = n;
      return;
    }
    r < 0 ? (n.left = e, n.right = e.right, e.right = null) : (n.right = e, n.left = e.left, e.left = null), this.root = n;
  }
  _first() {
    const n = this.root;
    return n == null ? null : (this.root = this.splayMin(n), this.root);
  }
  _last() {
    const n = this.root;
    return n == null ? null : (this.root = this.splayMax(n), this.root);
  }
  clear() {
    this.root = null, this.size = 0, this.modificationCount++;
  }
  has(n) {
    return this.validKey(n) && this.splay(n) == 0;
  }
  defaultCompare() {
    return (n, r) => n < r ? -1 : n > r ? 1 : 0;
  }
  wrap() {
    return {
      getRoot: () => this.root,
      setRoot: (n) => {
        this.root = n;
      },
      getSize: () => this.size,
      getModificationCount: () => this.modificationCount,
      getSplayCount: () => this.splayCount,
      setSplayCount: (n) => {
        this.splayCount = n;
      },
      splay: (n) => this.splay(n),
      has: (n) => this.has(n)
    };
  }
}, rf, sf, Ca = class ns extends Rk {
  constructor(e, s) {
    super();
    R(this, "root", null);
    R(this, "compare");
    R(this, "validKey");
    R(this, rf, "[object Set]");
    this.compare = e ?? this.defaultCompare(), this.validKey = s ?? ((u) => u != null && u != null);
  }
  delete(e) {
    return this.validKey(e) ? this._delete(e) != null : !1;
  }
  deleteAll(e) {
    for (const s of e)
      this.delete(s);
  }
  forEach(e) {
    const s = this[Symbol.iterator]();
    let u;
    for (; u = s.next(), !u.done; )
      e(u.value, u.value, this);
  }
  add(e) {
    const s = this.splay(e);
    return s != 0 && this.addNewRoot(new Wi(e), s), this;
  }
  addAndReturn(e) {
    const s = this.splay(e);
    return s != 0 && this.addNewRoot(new Wi(e), s), this.root.key;
  }
  addAll(e) {
    for (const s of e)
      this.add(s);
  }
  isEmpty() {
    return this.root == null;
  }
  isNotEmpty() {
    return this.root != null;
  }
  single() {
    if (this.size == 0) throw "Bad state: No element";
    if (this.size > 1) throw "Bad state: Too many element";
    return this.root.key;
  }
  first() {
    if (this.size == 0) throw "Bad state: No element";
    return this._first().key;
  }
  last() {
    if (this.size == 0) throw "Bad state: No element";
    return this._last().key;
  }
  lastBefore(e) {
    if (e == null) throw "Invalid arguments(s)";
    if (this.root == null) return null;
    if (this.splay(e) < 0) return this.root.key;
    let u = this.root.left;
    if (u == null) return null;
    let c = u.right;
    for (; c != null; )
      u = c, c = u.right;
    return u.key;
  }
  firstAfter(e) {
    if (e == null) throw "Invalid arguments(s)";
    if (this.root == null) return null;
    if (this.splay(e) > 0) return this.root.key;
    let u = this.root.right;
    if (u == null) return null;
    let c = u.left;
    for (; c != null; )
      u = c, c = u.left;
    return u.key;
  }
  retainAll(e) {
    const s = new ns(this.compare, this.validKey), u = this.modificationCount;
    for (const c of e) {
      if (u != this.modificationCount)
        throw "Concurrent modification during iteration.";
      this.validKey(c) && this.splay(c) == 0 && s.add(this.root.key);
    }
    s.size != this.size && (this.root = s.root, this.size = s.size, this.modificationCount++);
  }
  lookup(e) {
    return !this.validKey(e) || this.splay(e) != 0 ? null : this.root.key;
  }
  intersection(e) {
    const s = new ns(this.compare, this.validKey);
    for (const u of this)
      e.has(u) && s.add(u);
    return s;
  }
  difference(e) {
    const s = new ns(this.compare, this.validKey);
    for (const u of this)
      e.has(u) || s.add(u);
    return s;
  }
  union(e) {
    const s = this.clone();
    return s.addAll(e), s;
  }
  clone() {
    const e = new ns(this.compare, this.validKey);
    return e.size = this.size, e.root = this.copyNode(this.root), e;
  }
  copyNode(e) {
    if (e == null) return null;
    function s(c, f) {
      let h, m;
      do {
        if (h = c.left, m = c.right, h != null) {
          const d = new Wi(h.key);
          f.left = d, s(h, d);
        }
        if (m != null) {
          const d = new Wi(m.key);
          f.right = d, c = m, f = d;
        }
      } while (m != null);
    }
    const u = new Wi(e.key);
    return s(e, u), u;
  }
  toSet() {
    return this.clone();
  }
  entries() {
    return new Fk(this.wrap());
  }
  keys() {
    return this[Symbol.iterator]();
  }
  values() {
    return this[Symbol.iterator]();
  }
  [(sf = Symbol.iterator, rf = Symbol.toStringTag, sf)]() {
    return new Dk(this.wrap());
  }
}, wd = class {
  constructor(n) {
    R(this, "tree");
    R(this, "path", new Array());
    R(this, "modificationCount", null);
    R(this, "splayCount");
    this.tree = n, this.splayCount = n.getSplayCount();
  }
  [Symbol.iterator]() {
    return this;
  }
  next() {
    return this.moveNext() ? { done: !1, value: this.current() } : { done: !0, value: null };
  }
  current() {
    if (!this.path.length) return null;
    const n = this.path[this.path.length - 1];
    return this.getValue(n);
  }
  rebuildPath(n) {
    this.path.splice(0, this.path.length), this.tree.splay(n), this.path.push(this.tree.getRoot()), this.splayCount = this.tree.getSplayCount();
  }
  findLeftMostDescendent(n) {
    for (; n != null; )
      this.path.push(n), n = n.left;
  }
  moveNext() {
    if (this.modificationCount != this.tree.getModificationCount()) {
      if (this.modificationCount == null) {
        this.modificationCount = this.tree.getModificationCount();
        let e = this.tree.getRoot();
        for (; e != null; )
          this.path.push(e), e = e.left;
        return this.path.length > 0;
      }
      throw "Concurrent modification during iteration.";
    }
    if (!this.path.length) return !1;
    this.splayCount != this.tree.getSplayCount() && this.rebuildPath(this.path[this.path.length - 1].key);
    let n = this.path[this.path.length - 1], r = n.right;
    if (r != null) {
      for (; r != null; )
        this.path.push(r), r = r.left;
      return !0;
    }
    for (this.path.pop(); this.path.length && this.path[this.path.length - 1].right === n; )
      n = this.path.pop();
    return this.path.length > 0;
  }
}, Dk = class extends wd {
  getValue(n) {
    return n.key;
  }
}, Fk = class extends wd {
  getValue(n) {
    return [n.key, n.key];
  }
}, kd = (n) => () => n, yu = (n) => {
  const r = n ? (e, s) => s.minus(e).abs().isLessThanOrEqualTo(n) : kd(!1);
  return (e, s) => r(e, s) ? 0 : e.comparedTo(s);
};
function Gk(n) {
  const r = n ? (e, s, u, c, f) => e.exponentiatedBy(2).isLessThanOrEqualTo(
    c.minus(s).exponentiatedBy(2).plus(f.minus(u).exponentiatedBy(2)).times(n)
  ) : kd(!1);
  return (e, s, u) => {
    const c = e.x, f = e.y, h = u.x, m = u.y, d = f.minus(m).times(s.x.minus(h)).minus(c.minus(h).times(s.y.minus(m)));
    return r(d, c, f, h, m) ? 0 : d.comparedTo(0);
  };
}
var Bk = (n) => n, Uk = (n) => {
  if (n) {
    const r = new Ca(yu(n)), e = new Ca(yu(n)), s = (c, f) => f.addAndReturn(c), u = (c) => ({
      x: s(c.x, r),
      y: s(c.y, e)
    });
    return u({ x: new In(0), y: new In(0) }), u;
  }
  return Bk;
}, _u = (n) => ({
  set: (r) => {
    Jn = _u(r);
  },
  reset: () => _u(n),
  compare: yu(n),
  snap: Uk(n),
  orient: Gk(n)
}), Jn = _u(), Zi = (n, r) => n.ll.x.isLessThanOrEqualTo(r.x) && r.x.isLessThanOrEqualTo(n.ur.x) && n.ll.y.isLessThanOrEqualTo(r.y) && r.y.isLessThanOrEqualTo(n.ur.y), Eu = (n, r) => {
  if (r.ur.x.isLessThan(n.ll.x) || n.ur.x.isLessThan(r.ll.x) || r.ur.y.isLessThan(n.ll.y) || n.ur.y.isLessThan(r.ll.y))
    return null;
  const e = n.ll.x.isLessThan(r.ll.x) ? r.ll.x : n.ll.x, s = n.ur.x.isLessThan(r.ur.x) ? n.ur.x : r.ur.x, u = n.ll.y.isLessThan(r.ll.y) ? r.ll.y : n.ll.y, c = n.ur.y.isLessThan(r.ur.y) ? n.ur.y : r.ur.y;
  return { ll: { x: e, y: u }, ur: { x: s, y: c } };
}, ua = (n, r) => n.x.times(r.y).minus(n.y.times(r.x)), Sd = (n, r) => n.x.times(r.x).plus(n.y.times(r.y)), Aa = (n) => Sd(n, n).sqrt(), zk = (n, r, e) => {
  const s = { x: r.x.minus(n.x), y: r.y.minus(n.y) }, u = { x: e.x.minus(n.x), y: e.y.minus(n.y) };
  return ua(u, s).div(Aa(u)).div(Aa(s));
}, qk = (n, r, e) => {
  const s = { x: r.x.minus(n.x), y: r.y.minus(n.y) }, u = { x: e.x.minus(n.x), y: e.y.minus(n.y) };
  return Sd(u, s).div(Aa(u)).div(Aa(s));
}, Hh = (n, r, e) => r.y.isZero() ? null : { x: n.x.plus(r.x.div(r.y).times(e.minus(n.y))), y: e }, Jh = (n, r, e) => r.x.isZero() ? null : { x: e, y: n.y.plus(r.y.div(r.x).times(e.minus(n.x))) }, Yk = (n, r, e, s) => {
  if (r.x.isZero()) return Jh(e, s, n.x);
  if (s.x.isZero()) return Jh(n, r, e.x);
  if (r.y.isZero()) return Hh(e, s, n.y);
  if (s.y.isZero()) return Hh(n, r, e.y);
  const u = ua(r, s);
  if (u.isZero()) return null;
  const c = { x: e.x.minus(n.x), y: e.y.minus(n.y) }, f = ua(c, r).div(u), h = ua(c, s).div(u), m = n.x.plus(h.times(r.x)), d = e.x.plus(f.times(s.x)), y = n.y.plus(h.times(r.y)), _ = e.y.plus(f.times(s.y)), E = m.plus(d).div(2), S = y.plus(_).div(2);
  return { x: E, y: S };
}, xn = class Md {
  // Warning: 'point' input will be modified and re-used (for performance)
  constructor(r, e) {
    R(this, "point");
    R(this, "isLeft");
    R(this, "segment");
    R(this, "otherSE");
    R(this, "consumedBy");
    r.events === void 0 ? r.events = [this] : r.events.push(this), this.point = r, this.isLeft = e;
  }
  // for ordering sweep events in the sweep event queue
  static compare(r, e) {
    const s = Md.comparePoints(r.point, e.point);
    return s !== 0 ? s : (r.point !== e.point && r.link(e), r.isLeft !== e.isLeft ? r.isLeft ? 1 : -1 : Oa.compare(r.segment, e.segment));
  }
  // for ordering points in sweep line order
  static comparePoints(r, e) {
    return r.x.isLessThan(e.x) ? -1 : r.x.isGreaterThan(e.x) ? 1 : r.y.isLessThan(e.y) ? -1 : r.y.isGreaterThan(e.y) ? 1 : 0;
  }
  link(r) {
    if (r.point === this.point)
      throw new Error("Tried to link already linked events");
    const e = r.point.events;
    for (let s = 0, u = e.length; s < u; s++) {
      const c = e[s];
      this.point.events.push(c), c.point = this.point;
    }
    this.checkForConsuming();
  }
  /* Do a pass over our linked events and check to see if any pair
   * of segments match, and should be consumed. */
  checkForConsuming() {
    const r = this.point.events.length;
    for (let e = 0; e < r; e++) {
      const s = this.point.events[e];
      if (s.segment.consumedBy === void 0)
        for (let u = e + 1; u < r; u++) {
          const c = this.point.events[u];
          c.consumedBy === void 0 && s.otherSE.point.events === c.otherSE.point.events && s.segment.consume(c.segment);
        }
    }
  }
  getAvailableLinkedEvents() {
    const r = [];
    for (let e = 0, s = this.point.events.length; e < s; e++) {
      const u = this.point.events[e];
      u !== this && !u.segment.ringOut && u.segment.isInResult() && r.push(u);
    }
    return r;
  }
  /**
   * Returns a comparator function for sorting linked events that will
   * favor the event that will give us the smallest left-side angle.
   * All ring construction starts as low as possible heading to the right,
   * so by always turning left as sharp as possible we'll get polygons
   * without uncessary loops & holes.
   *
   * The comparator function has a compute cache such that it avoids
   * re-computing already-computed values.
   */
  getLeftmostComparator(r) {
    const e = /* @__PURE__ */ new Map(), s = (u) => {
      const c = u.otherSE;
      e.set(u, {
        sine: zk(this.point, r.point, c.point),
        cosine: qk(this.point, r.point, c.point)
      });
    };
    return (u, c) => {
      e.has(u) || s(u), e.has(c) || s(c);
      const { sine: f, cosine: h } = e.get(u), { sine: m, cosine: d } = e.get(c);
      return f.isGreaterThanOrEqualTo(0) && m.isGreaterThanOrEqualTo(0) ? h.isLessThan(d) ? 1 : h.isGreaterThan(d) ? -1 : 0 : f.isLessThan(0) && m.isLessThan(0) ? h.isLessThan(d) ? -1 : h.isGreaterThan(d) ? 1 : 0 : m.isLessThan(f) ? -1 : m.isGreaterThan(f) ? 1 : 0;
    };
  }
}, Hk = class xu {
  constructor(r) {
    R(this, "events");
    R(this, "poly");
    R(this, "_isExteriorRing");
    R(this, "_enclosingRing");
    this.events = r;
    for (let e = 0, s = r.length; e < s; e++)
      r[e].segment.ringOut = this;
    this.poly = null;
  }
  /* Given the segments from the sweep line pass, compute & return a series
   * of closed rings from all the segments marked to be part of the result */
  static factory(r) {
    const e = [];
    for (let s = 0, u = r.length; s < u; s++) {
      const c = r[s];
      if (!c.isInResult() || c.ringOut) continue;
      let f = null, h = c.leftSE, m = c.rightSE;
      const d = [h], y = h.point, _ = [];
      for (; f = h, h = m, d.push(h), h.point !== y; )
        for (; ; ) {
          const E = h.getAvailableLinkedEvents();
          if (E.length === 0) {
            const D = d[0].point, q = d[d.length - 1].point;
            throw new Error(
              `Unable to complete output ring starting at [${D.x}, ${D.y}]. Last matching segment found ends at [${q.x}, ${q.y}].`
            );
          }
          if (E.length === 1) {
            m = E[0].otherSE;
            break;
          }
          let S = null;
          for (let D = 0, q = _.length; D < q; D++)
            if (_[D].point === h.point) {
              S = D;
              break;
            }
          if (S !== null) {
            const D = _.splice(S)[0], q = d.splice(D.index);
            q.unshift(q[0].otherSE), e.push(new xu(q.reverse()));
            continue;
          }
          _.push({
            index: d.length,
            point: h.point
          });
          const I = h.getLeftmostComparator(f);
          m = E.sort(I)[0].otherSE;
          break;
        }
      e.push(new xu(d));
    }
    return e;
  }
  getGeom() {
    let r = this.events[0].point;
    const e = [r];
    for (let d = 1, y = this.events.length - 1; d < y; d++) {
      const _ = this.events[d].point, E = this.events[d + 1].point;
      Jn.orient(_, r, E) !== 0 && (e.push(_), r = _);
    }
    if (e.length === 1) return null;
    const s = e[0], u = e[1];
    Jn.orient(s, r, u) === 0 && e.shift(), e.push(e[0]);
    const c = this.isExteriorRing() ? 1 : -1, f = this.isExteriorRing() ? 0 : e.length - 1, h = this.isExteriorRing() ? e.length : -1, m = [];
    for (let d = f; d != h; d += c)
      m.push([e[d].x.toNumber(), e[d].y.toNumber()]);
    return m;
  }
  isExteriorRing() {
    if (this._isExteriorRing === void 0) {
      const r = this.enclosingRing();
      this._isExteriorRing = r ? !r.isExteriorRing() : !0;
    }
    return this._isExteriorRing;
  }
  enclosingRing() {
    return this._enclosingRing === void 0 && (this._enclosingRing = this._calcEnclosingRing()), this._enclosingRing;
  }
  /* Returns the ring that encloses this one, if any */
  _calcEnclosingRing() {
    var u, c;
    let r = this.events[0];
    for (let f = 1, h = this.events.length; f < h; f++) {
      const m = this.events[f];
      xn.compare(r, m) > 0 && (r = m);
    }
    let e = r.segment.prevInResult(), s = e ? e.prevInResult() : null;
    for (; ; ) {
      if (!e) return null;
      if (!s) return e.ringOut;
      if (s.ringOut !== e.ringOut)
        return ((u = s.ringOut) == null ? void 0 : u.enclosingRing()) !== e.ringOut ? e.ringOut : (c = e.ringOut) == null ? void 0 : c.enclosingRing();
      e = s.prevInResult(), s = e ? e.prevInResult() : null;
    }
  }
}, Vh = class {
  constructor(n) {
    R(this, "exteriorRing");
    R(this, "interiorRings");
    this.exteriorRing = n, n.poly = this, this.interiorRings = [];
  }
  addInterior(n) {
    this.interiorRings.push(n), n.poly = this;
  }
  getGeom() {
    const n = this.exteriorRing.getGeom();
    if (n === null) return null;
    const r = [n];
    for (let e = 0, s = this.interiorRings.length; e < s; e++) {
      const u = this.interiorRings[e].getGeom();
      u !== null && r.push(u);
    }
    return r;
  }
}, Jk = class {
  constructor(n) {
    R(this, "rings");
    R(this, "polys");
    this.rings = n, this.polys = this._composePolys(n);
  }
  getGeom() {
    const n = [];
    for (let r = 0, e = this.polys.length; r < e; r++) {
      const s = this.polys[r].getGeom();
      s !== null && n.push(s);
    }
    return n;
  }
  _composePolys(n) {
    var e;
    const r = [];
    for (let s = 0, u = n.length; s < u; s++) {
      const c = n[s];
      if (!c.poly)
        if (c.isExteriorRing()) r.push(new Vh(c));
        else {
          const f = c.enclosingRing();
          f != null && f.poly || r.push(new Vh(f)), (e = f == null ? void 0 : f.poly) == null || e.addInterior(c);
        }
    }
    return r;
  }
}, Vk = class {
  constructor(n, r = Oa.compare) {
    R(this, "queue");
    R(this, "tree");
    R(this, "segments");
    this.queue = n, this.tree = new Ca(r), this.segments = [];
  }
  process(n) {
    const r = n.segment, e = [];
    if (n.consumedBy)
      return n.isLeft ? this.queue.delete(n.otherSE) : this.tree.delete(r), e;
    n.isLeft && this.tree.add(r);
    let s = r, u = r;
    do
      s = this.tree.lastBefore(s);
    while (s != null && s.consumedBy != null);
    do
      u = this.tree.firstAfter(u);
    while (u != null && u.consumedBy != null);
    if (n.isLeft) {
      let c = null;
      if (s) {
        const h = s.getIntersection(r);
        if (h !== null && (r.isAnEndpoint(h) || (c = h), !s.isAnEndpoint(h))) {
          const m = this._splitSafely(s, h);
          for (let d = 0, y = m.length; d < y; d++)
            e.push(m[d]);
        }
      }
      let f = null;
      if (u) {
        const h = u.getIntersection(r);
        if (h !== null && (r.isAnEndpoint(h) || (f = h), !u.isAnEndpoint(h))) {
          const m = this._splitSafely(u, h);
          for (let d = 0, y = m.length; d < y; d++)
            e.push(m[d]);
        }
      }
      if (c !== null || f !== null) {
        let h = null;
        c === null ? h = f : f === null ? h = c : h = xn.comparePoints(
          c,
          f
        ) <= 0 ? c : f, this.queue.delete(r.rightSE), e.push(r.rightSE);
        const m = r.split(h);
        for (let d = 0, y = m.length; d < y; d++)
          e.push(m[d]);
      }
      e.length > 0 ? (this.tree.delete(r), e.push(n)) : (this.segments.push(r), r.prev = s);
    } else {
      if (s && u) {
        const c = s.getIntersection(u);
        if (c !== null) {
          if (!s.isAnEndpoint(c)) {
            const f = this._splitSafely(s, c);
            for (let h = 0, m = f.length; h < m; h++)
              e.push(f[h]);
          }
          if (!u.isAnEndpoint(c)) {
            const f = this._splitSafely(u, c);
            for (let h = 0, m = f.length; h < m; h++)
              e.push(f[h]);
          }
        }
      }
      this.tree.delete(r);
    }
    return e;
  }
  /* Safely split a segment that is currently in the datastructures
   * IE - a segment other than the one that is currently being processed. */
  _splitSafely(n, r) {
    this.tree.delete(n);
    const e = n.rightSE;
    this.queue.delete(e);
    const s = n.split(r);
    return s.push(e), n.consumedBy === void 0 && this.tree.add(n), s;
  }
}, Xk = class {
  constructor() {
    R(this, "type");
    R(this, "numMultiPolys");
  }
  run(n, r, e) {
    rs.type = n;
    const s = [new Wh(r, !0)];
    for (let d = 0, y = e.length; d < y; d++)
      s.push(new Wh(e[d], !1));
    if (rs.numMultiPolys = s.length, rs.type === "difference") {
      const d = s[0];
      let y = 1;
      for (; y < s.length; )
        Eu(s[y].bbox, d.bbox) !== null ? y++ : s.splice(y, 1);
    }
    if (rs.type === "intersection")
      for (let d = 0, y = s.length; d < y; d++) {
        const _ = s[d];
        for (let E = d + 1, S = s.length; E < S; E++)
          if (Eu(_.bbox, s[E].bbox) === null) return [];
      }
    const u = new Ca(xn.compare);
    for (let d = 0, y = s.length; d < y; d++) {
      const _ = s[d].getSweepEvents();
      for (let E = 0, S = _.length; E < S; E++)
        u.add(_[E]);
    }
    const c = new Vk(u);
    let f = null;
    for (u.size != 0 && (f = u.first(), u.delete(f)); f; ) {
      const d = c.process(f);
      for (let y = 0, _ = d.length; y < _; y++) {
        const E = d[y];
        E.consumedBy === void 0 && u.add(E);
      }
      u.size != 0 ? (f = u.first(), u.delete(f)) : f = null;
    }
    Jn.reset();
    const h = Hk.factory(c.segments);
    return new Jk(h).getGeom();
  }
}, rs = new Xk(), Na = rs, Wk = 0, Oa = class la {
  /* Warning: a reference to ringWindings input will be stored,
   *  and possibly will be later modified */
  constructor(r, e, s, u) {
    R(this, "id");
    R(this, "leftSE");
    R(this, "rightSE");
    R(this, "rings");
    R(this, "windings");
    R(this, "ringOut");
    R(this, "consumedBy");
    R(this, "prev");
    R(this, "_prevInResult");
    R(this, "_beforeState");
    R(this, "_afterState");
    R(this, "_isInResult");
    this.id = ++Wk, this.leftSE = r, r.segment = this, r.otherSE = e, this.rightSE = e, e.segment = this, e.otherSE = r, this.rings = s, this.windings = u;
  }
  /* This compare() function is for ordering segments in the sweep
   * line tree, and does so according to the following criteria:
   *
   * Consider the vertical line that lies an infinestimal step to the
   * right of the right-more of the two left endpoints of the input
   * segments. Imagine slowly moving a point up from negative infinity
   * in the increasing y direction. Which of the two segments will that
   * point intersect first? That segment comes 'before' the other one.
   *
   * If neither segment would be intersected by such a line, (if one
   * or more of the segments are vertical) then the line to be considered
   * is directly on the right-more of the two left inputs.
   */
  static compare(r, e) {
    const s = r.leftSE.point.x, u = e.leftSE.point.x, c = r.rightSE.point.x, f = e.rightSE.point.x;
    if (f.isLessThan(s)) return 1;
    if (c.isLessThan(u)) return -1;
    const h = r.leftSE.point.y, m = e.leftSE.point.y, d = r.rightSE.point.y, y = e.rightSE.point.y;
    if (s.isLessThan(u)) {
      if (m.isLessThan(h) && m.isLessThan(d)) return 1;
      if (m.isGreaterThan(h) && m.isGreaterThan(d)) return -1;
      const _ = r.comparePoint(e.leftSE.point);
      if (_ < 0) return 1;
      if (_ > 0) return -1;
      const E = e.comparePoint(r.rightSE.point);
      return E !== 0 ? E : -1;
    }
    if (s.isGreaterThan(u)) {
      if (h.isLessThan(m) && h.isLessThan(y)) return -1;
      if (h.isGreaterThan(m) && h.isGreaterThan(y)) return 1;
      const _ = e.comparePoint(r.leftSE.point);
      if (_ !== 0) return _;
      const E = r.comparePoint(e.rightSE.point);
      return E < 0 ? 1 : E > 0 ? -1 : 1;
    }
    if (h.isLessThan(m)) return -1;
    if (h.isGreaterThan(m)) return 1;
    if (c.isLessThan(f)) {
      const _ = e.comparePoint(r.rightSE.point);
      if (_ !== 0) return _;
    }
    if (c.isGreaterThan(f)) {
      const _ = r.comparePoint(e.rightSE.point);
      if (_ < 0) return 1;
      if (_ > 0) return -1;
    }
    if (!c.eq(f)) {
      const _ = d.minus(h), E = c.minus(s), S = y.minus(m), I = f.minus(u);
      if (_.isGreaterThan(E) && S.isLessThan(I)) return 1;
      if (_.isLessThan(E) && S.isGreaterThan(I)) return -1;
    }
    return c.isGreaterThan(f) ? 1 : c.isLessThan(f) || d.isLessThan(y) ? -1 : d.isGreaterThan(y) ? 1 : r.id < e.id ? -1 : r.id > e.id ? 1 : 0;
  }
  static fromRing(r, e, s) {
    let u, c, f;
    const h = xn.comparePoints(r, e);
    if (h < 0)
      u = r, c = e, f = 1;
    else if (h > 0)
      u = e, c = r, f = -1;
    else
      throw new Error(
        `Tried to create degenerate segment at [${r.x}, ${r.y}]`
      );
    const m = new xn(u, !0), d = new xn(c, !1);
    return new la(m, d, [s], [f]);
  }
  /* When a segment is split, the rightSE is replaced with a new sweep event */
  replaceRightSE(r) {
    this.rightSE = r, this.rightSE.segment = this, this.rightSE.otherSE = this.leftSE, this.leftSE.otherSE = this.rightSE;
  }
  bbox() {
    const r = this.leftSE.point.y, e = this.rightSE.point.y;
    return {
      ll: { x: this.leftSE.point.x, y: r.isLessThan(e) ? r : e },
      ur: { x: this.rightSE.point.x, y: r.isGreaterThan(e) ? r : e }
    };
  }
  /* A vector from the left point to the right */
  vector() {
    return {
      x: this.rightSE.point.x.minus(this.leftSE.point.x),
      y: this.rightSE.point.y.minus(this.leftSE.point.y)
    };
  }
  isAnEndpoint(r) {
    return r.x.eq(this.leftSE.point.x) && r.y.eq(this.leftSE.point.y) || r.x.eq(this.rightSE.point.x) && r.y.eq(this.rightSE.point.y);
  }
  /* Compare this segment with a point.
   *
   * A point P is considered to be colinear to a segment if there
   * exists a distance D such that if we travel along the segment
   * from one * endpoint towards the other a distance D, we find
   * ourselves at point P.
   *
   * Return value indicates:
   *
   *   1: point lies above the segment (to the left of vertical)
   *   0: point is colinear to segment
   *  -1: point lies below the segment (to the right of vertical)
   */
  comparePoint(r) {
    return Jn.orient(this.leftSE.point, r, this.rightSE.point);
  }
  /**
   * Given another segment, returns the first non-trivial intersection
   * between the two segments (in terms of sweep line ordering), if it exists.
   *
   * A 'non-trivial' intersection is one that will cause one or both of the
   * segments to be split(). As such, 'trivial' vs. 'non-trivial' intersection:
   *
   *   * endpoint of segA with endpoint of segB --> trivial
   *   * endpoint of segA with point along segB --> non-trivial
   *   * endpoint of segB with point along segA --> non-trivial
   *   * point along segA with point along segB --> non-trivial
   *
   * If no non-trivial intersection exists, return null
   * Else, return null.
   */
  getIntersection(r) {
    const e = this.bbox(), s = r.bbox(), u = Eu(e, s);
    if (u === null) return null;
    const c = this.leftSE.point, f = this.rightSE.point, h = r.leftSE.point, m = r.rightSE.point, d = Zi(e, h) && this.comparePoint(h) === 0, y = Zi(s, c) && r.comparePoint(c) === 0, _ = Zi(e, m) && this.comparePoint(m) === 0, E = Zi(s, f) && r.comparePoint(f) === 0;
    if (y && d)
      return E && !_ ? f : !E && _ ? m : null;
    if (y)
      return _ && c.x.eq(m.x) && c.y.eq(m.y) ? null : c;
    if (d)
      return E && f.x.eq(h.x) && f.y.eq(h.y) ? null : h;
    if (E && _) return null;
    if (E) return f;
    if (_) return m;
    const S = Yk(c, this.vector(), h, r.vector());
    return S === null || !Zi(u, S) ? null : Jn.snap(S);
  }
  /**
   * Split the given segment into multiple segments on the given points.
   *  * Each existing segment will retain its leftSE and a new rightSE will be
   *    generated for it.
   *  * A new segment will be generated which will adopt the original segment's
   *    rightSE, and a new leftSE will be generated for it.
   *  * If there are more than two points given to split on, new segments
   *    in the middle will be generated with new leftSE and rightSE's.
   *  * An array of the newly generated SweepEvents will be returned.
   *
   * Warning: input array of points is modified
   */
  split(r) {
    const e = [], s = r.events !== void 0, u = new xn(r, !0), c = new xn(r, !1), f = this.rightSE;
    this.replaceRightSE(c), e.push(c), e.push(u);
    const h = new la(
      u,
      f,
      this.rings.slice(),
      this.windings.slice()
    );
    return xn.comparePoints(h.leftSE.point, h.rightSE.point) > 0 && h.swapEvents(), xn.comparePoints(this.leftSE.point, this.rightSE.point) > 0 && this.swapEvents(), s && (u.checkForConsuming(), c.checkForConsuming()), e;
  }
  /* Swap which event is left and right */
  swapEvents() {
    const r = this.rightSE;
    this.rightSE = this.leftSE, this.leftSE = r, this.leftSE.isLeft = !0, this.rightSE.isLeft = !1;
    for (let e = 0, s = this.windings.length; e < s; e++)
      this.windings[e] *= -1;
  }
  /* Consume another segment. We take their rings under our wing
   * and mark them as consumed. Use for perfectly overlapping segments */
  consume(r) {
    let e = this, s = r;
    for (; e.consumedBy; ) e = e.consumedBy;
    for (; s.consumedBy; ) s = s.consumedBy;
    const u = la.compare(e, s);
    if (u !== 0) {
      if (u > 0) {
        const c = e;
        e = s, s = c;
      }
      if (e.prev === s) {
        const c = e;
        e = s, s = c;
      }
      for (let c = 0, f = s.rings.length; c < f; c++) {
        const h = s.rings[c], m = s.windings[c], d = e.rings.indexOf(h);
        d === -1 ? (e.rings.push(h), e.windings.push(m)) : e.windings[d] += m;
      }
      s.rings = null, s.windings = null, s.consumedBy = e, s.leftSE.consumedBy = e.leftSE, s.rightSE.consumedBy = e.rightSE;
    }
  }
  /* The first segment previous segment chain that is in the result */
  prevInResult() {
    return this._prevInResult !== void 0 ? this._prevInResult : (this.prev ? this.prev.isInResult() ? this._prevInResult = this.prev : this._prevInResult = this.prev.prevInResult() : this._prevInResult = null, this._prevInResult);
  }
  beforeState() {
    if (this._beforeState !== void 0) return this._beforeState;
    if (!this.prev)
      this._beforeState = {
        rings: [],
        windings: [],
        multiPolys: []
      };
    else {
      const r = this.prev.consumedBy || this.prev;
      this._beforeState = r.afterState();
    }
    return this._beforeState;
  }
  afterState() {
    if (this._afterState !== void 0) return this._afterState;
    const r = this.beforeState();
    this._afterState = {
      rings: r.rings.slice(0),
      windings: r.windings.slice(0),
      multiPolys: []
    };
    const e = this._afterState.rings, s = this._afterState.windings, u = this._afterState.multiPolys;
    for (let h = 0, m = this.rings.length; h < m; h++) {
      const d = this.rings[h], y = this.windings[h], _ = e.indexOf(d);
      _ === -1 ? (e.push(d), s.push(y)) : s[_] += y;
    }
    const c = [], f = [];
    for (let h = 0, m = e.length; h < m; h++) {
      if (s[h] === 0) continue;
      const d = e[h], y = d.poly;
      if (f.indexOf(y) === -1)
        if (d.isExterior) c.push(y);
        else {
          f.indexOf(y) === -1 && f.push(y);
          const _ = c.indexOf(d.poly);
          _ !== -1 && c.splice(_, 1);
        }
    }
    for (let h = 0, m = c.length; h < m; h++) {
      const d = c[h].multiPoly;
      u.indexOf(d) === -1 && u.push(d);
    }
    return this._afterState;
  }
  /* Is this segment part of the final result? */
  isInResult() {
    if (this.consumedBy) return !1;
    if (this._isInResult !== void 0) return this._isInResult;
    const r = this.beforeState().multiPolys, e = this.afterState().multiPolys;
    switch (Na.type) {
      case "union": {
        const s = r.length === 0, u = e.length === 0;
        this._isInResult = s !== u;
        break;
      }
      case "intersection": {
        let s, u;
        r.length < e.length ? (s = r.length, u = e.length) : (s = e.length, u = r.length), this._isInResult = u === Na.numMultiPolys && s < u;
        break;
      }
      case "xor": {
        const s = Math.abs(r.length - e.length);
        this._isInResult = s % 2 === 1;
        break;
      }
      case "difference": {
        const s = (u) => u.length === 1 && u[0].isSubject;
        this._isInResult = s(r) !== s(e);
        break;
      }
    }
    return this._isInResult;
  }
}, Xh = class {
  constructor(n, r, e) {
    R(this, "poly");
    R(this, "isExterior");
    R(this, "segments");
    R(this, "bbox");
    if (!Array.isArray(n) || n.length === 0)
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    if (this.poly = r, this.isExterior = e, this.segments = [], typeof n[0][0] != "number" || typeof n[0][1] != "number")
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    const s = Jn.snap({ x: new In(n[0][0]), y: new In(n[0][1]) });
    this.bbox = {
      ll: { x: s.x, y: s.y },
      ur: { x: s.x, y: s.y }
    };
    let u = s;
    for (let c = 1, f = n.length; c < f; c++) {
      if (typeof n[c][0] != "number" || typeof n[c][1] != "number")
        throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
      const h = Jn.snap({ x: new In(n[c][0]), y: new In(n[c][1]) });
      h.x.eq(u.x) && h.y.eq(u.y) || (this.segments.push(Oa.fromRing(u, h, this)), h.x.isLessThan(this.bbox.ll.x) && (this.bbox.ll.x = h.x), h.y.isLessThan(this.bbox.ll.y) && (this.bbox.ll.y = h.y), h.x.isGreaterThan(this.bbox.ur.x) && (this.bbox.ur.x = h.x), h.y.isGreaterThan(this.bbox.ur.y) && (this.bbox.ur.y = h.y), u = h);
    }
    (!s.x.eq(u.x) || !s.y.eq(u.y)) && this.segments.push(Oa.fromRing(u, s, this));
  }
  getSweepEvents() {
    const n = [];
    for (let r = 0, e = this.segments.length; r < e; r++) {
      const s = this.segments[r];
      n.push(s.leftSE), n.push(s.rightSE);
    }
    return n;
  }
}, Zk = class {
  constructor(n, r) {
    R(this, "multiPoly");
    R(this, "exteriorRing");
    R(this, "interiorRings");
    R(this, "bbox");
    if (!Array.isArray(n))
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    this.exteriorRing = new Xh(n[0], this, !0), this.bbox = {
      ll: { x: this.exteriorRing.bbox.ll.x, y: this.exteriorRing.bbox.ll.y },
      ur: { x: this.exteriorRing.bbox.ur.x, y: this.exteriorRing.bbox.ur.y }
    }, this.interiorRings = [];
    for (let e = 1, s = n.length; e < s; e++) {
      const u = new Xh(n[e], this, !1);
      u.bbox.ll.x.isLessThan(this.bbox.ll.x) && (this.bbox.ll.x = u.bbox.ll.x), u.bbox.ll.y.isLessThan(this.bbox.ll.y) && (this.bbox.ll.y = u.bbox.ll.y), u.bbox.ur.x.isGreaterThan(this.bbox.ur.x) && (this.bbox.ur.x = u.bbox.ur.x), u.bbox.ur.y.isGreaterThan(this.bbox.ur.y) && (this.bbox.ur.y = u.bbox.ur.y), this.interiorRings.push(u);
    }
    this.multiPoly = r;
  }
  getSweepEvents() {
    const n = this.exteriorRing.getSweepEvents();
    for (let r = 0, e = this.interiorRings.length; r < e; r++) {
      const s = this.interiorRings[r].getSweepEvents();
      for (let u = 0, c = s.length; u < c; u++)
        n.push(s[u]);
    }
    return n;
  }
}, Wh = class {
  constructor(n, r) {
    R(this, "isSubject");
    R(this, "polys");
    R(this, "bbox");
    if (!Array.isArray(n))
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    try {
      typeof n[0][0][0] == "number" && (n = [n]);
    } catch {
    }
    this.polys = [], this.bbox = {
      ll: { x: new In(Number.POSITIVE_INFINITY), y: new In(Number.POSITIVE_INFINITY) },
      ur: { x: new In(Number.NEGATIVE_INFINITY), y: new In(Number.NEGATIVE_INFINITY) }
    };
    for (let e = 0, s = n.length; e < s; e++) {
      const u = new Zk(n[e], this);
      u.bbox.ll.x.isLessThan(this.bbox.ll.x) && (this.bbox.ll.x = u.bbox.ll.x), u.bbox.ll.y.isLessThan(this.bbox.ll.y) && (this.bbox.ll.y = u.bbox.ll.y), u.bbox.ur.x.isGreaterThan(this.bbox.ur.x) && (this.bbox.ur.x = u.bbox.ur.x), u.bbox.ur.y.isGreaterThan(this.bbox.ur.y) && (this.bbox.ur.y = u.bbox.ur.y), this.polys.push(u);
    }
    this.isSubject = r;
  }
  getSweepEvents() {
    const n = [];
    for (let r = 0, e = this.polys.length; r < e; r++) {
      const s = this.polys[r].getSweepEvents();
      for (let u = 0, c = s.length; u < c; u++)
        n.push(s[u]);
    }
    return n;
  }
}, jk = (n, ...r) => Na.run("union", n, r), $k = (n, ...r) => Na.run("difference", n, r);
Jn.set;
function Kk(n) {
  const r = [];
  if (gr(n, (u) => {
    r.push(u.coordinates);
  }), r.length < 2)
    throw new Error("Must have at least two features");
  const e = n.features[0].properties || {}, s = $k(r[0], ...r.slice(1));
  return s.length === 0 ? null : s.length === 1 ? or(s[0], e) : Mu(s, e);
}
var Id = Kk;
function bd(n) {
  var r = new Vt(n);
  return r.insert = function(e) {
    if (e.type !== "Feature") throw new Error("invalid feature");
    return e.bbox = e.bbox ? e.bbox : wn(e), Vt.prototype.insert.call(this, e);
  }, r.load = function(e) {
    var s = [];
    return Array.isArray(e) ? e.forEach(function(u) {
      if (u.type !== "Feature") throw new Error("invalid features");
      u.bbox = u.bbox ? u.bbox : wn(u), s.push(u);
    }) : Tn(e, function(u) {
      if (u.type !== "Feature") throw new Error("invalid features");
      u.bbox = u.bbox ? u.bbox : wn(u), s.push(u);
    }), Vt.prototype.load.call(this, s);
  }, r.remove = function(e, s) {
    if (e.type !== "Feature") throw new Error("invalid feature");
    return e.bbox = e.bbox ? e.bbox : wn(e), Vt.prototype.remove.call(this, e, s);
  }, r.clear = function() {
    return Vt.prototype.clear.call(this);
  }, r.search = function(e) {
    var s = Vt.prototype.search.call(this, this.toBBox(e));
    return Ke(s);
  }, r.collides = function(e) {
    return Vt.prototype.collides.call(this, this.toBBox(e));
  }, r.all = function() {
    var e = Vt.prototype.all.call(this);
    return Ke(e);
  }, r.toJSON = function() {
    return Vt.prototype.toJSON.call(this);
  }, r.fromJSON = function(e) {
    return Vt.prototype.fromJSON.call(this, e);
  }, r.toBBox = function(e) {
    var s;
    if (e.bbox) s = e.bbox;
    else if (Array.isArray(e) && e.length === 4) s = e;
    else if (Array.isArray(e) && e.length === 6)
      s = [e[0], e[1], e[3], e[4]];
    else if (e.type === "Feature") s = wn(e);
    else if (e.type === "FeatureCollection") s = wn(e);
    else throw new Error("invalid geojson");
    return {
      minX: s[0],
      minY: s[1],
      maxX: s[2],
      maxY: s[3]
    };
  }, r;
}
function Qk(n) {
  var r = n[0], e = n[1], s = n[2], u = n[3], c = on(n.slice(0, 2), [s, e]), f = on(n.slice(0, 2), [r, u]);
  if (c >= f) {
    var h = (e + u) / 2;
    return [
      r,
      h - (s - r) / 2,
      s,
      h + (s - r) / 2
    ];
  } else {
    var m = (r + s) / 2;
    return [
      m - (u - e) / 2,
      e,
      m + (u - e) / 2,
      u
    ];
  }
}
function eS(n, r) {
  if (r = r ?? {}, !Tu(r)) throw new Error("options is invalid");
  var e = r.precision, s = r.coordinates, u = r.mutate;
  if (e = e == null || isNaN(e) ? 6 : e, s = s == null || isNaN(s) ? 3 : s, !n) throw new Error("<geojson> is required");
  if (typeof e != "number")
    throw new Error("<precision> must be a number");
  if (typeof s != "number")
    throw new Error("<coordinates> must be a number");
  (u === !1 || u === void 0) && (n = JSON.parse(JSON.stringify(n)));
  var c = Math.pow(10, e);
  return fr(n, function(f) {
    tS(f, c, s);
  }), n;
}
function tS(n, r, e) {
  n.length > e && n.splice(e, n.length);
  for (var s = 0; s < n.length; s++)
    n[s] = Math.round(n[s] * r) / r;
  return n;
}
function nS(n) {
  if (!n)
    throw new Error("geojson is required");
  const r = [];
  return ur(n, (e) => {
    rS(e, r);
  }), Ke(r);
}
function rS(n, r) {
  let e = [];
  const s = n.geometry;
  if (s !== null) {
    switch (s.type) {
      case "Polygon":
        e = Pt(s);
        break;
      case "LineString":
        e = [Pt(s)];
    }
    e.forEach((u) => {
      iS(u, n.properties).forEach((f) => {
        f.id = r.length, r.push(f);
      });
    });
  }
}
function iS(n, r) {
  const e = [];
  return n.reduce((s, u) => {
    const c = ls([s, u], r);
    return c.bbox = sS(s, u), e.push(c), u;
  }), e;
}
function sS(n, r) {
  const e = n[0], s = n[1], u = r[0], c = r[1], f = e < u ? e : u, h = s < c ? s : c, m = e > u ? e : u, d = s > c ? s : c;
  return [f, h, m, d];
}
var aS = Object.defineProperty, oS = Object.defineProperties, uS = Object.getOwnPropertyDescriptors, Zh = Object.getOwnPropertySymbols, lS = Object.prototype.hasOwnProperty, cS = Object.prototype.propertyIsEnumerable, jh = (n, r, e) => r in n ? aS(n, r, { enumerable: !0, configurable: !0, writable: !0, value: e }) : n[r] = e, $h = (n, r) => {
  for (var e in r || (r = {}))
    lS.call(r, e) && jh(n, e, r[e]);
  if (Zh)
    for (var e of Zh(r))
      cS.call(r, e) && jh(n, e, r[e]);
  return n;
}, Kh = (n, r) => oS(n, uS(r));
function hS(n, r, e = {}) {
  if (!n || !r)
    throw new Error("lines and pt are required arguments");
  const s = $e(r);
  let u = Un([1 / 0, 1 / 0], {
    dist: 1 / 0,
    index: -1,
    multiFeatureIndex: -1,
    location: -1
  }), c = 0;
  return ur(
    n,
    function(f, h, m) {
      const d = Pt(f);
      for (let y = 0; y < d.length - 1; y++) {
        const _ = Un(d[y]);
        _.properties.dist = on(r, _, e);
        const E = $e(_), S = Un(d[y + 1]);
        S.properties.dist = on(r, S, e);
        const I = $e(S), D = on(_, S, e);
        let q, G;
        E[0] === s[0] && E[1] === s[1] ? [q, , G] = [E, void 0, !1] : I[0] === s[0] && I[1] === s[1] ? [q, , G] = [I, void 0, !0] : [q, , G] = dS(
          _.geometry.coordinates,
          S.geometry.coordinates,
          $e(r)
        );
        let M;
        q && (M = Un(q, {
          dist: on(r, q, e),
          multiFeatureIndex: m,
          location: c + on(_, q, e)
        })), M && M.properties.dist < u.properties.dist && (u = Kh($h({}, M), {
          properties: Kh($h({}, M.properties), {
            // Legacy behaviour where index progresses to next segment # if we
            // went with the end point this iteration.
            index: G ? y + 1 : y
          })
        })), c += D;
      }
    }
  ), u;
}
function fS(n, r) {
  const [e, s, u] = n, [c, f, h] = r;
  return e * c + s * f + u * h;
}
function gS(n, r) {
  const [e, s, u] = n, [c, f, h] = r;
  return [s * h - u * f, u * c - e * h, e * f - s * c];
}
function Qh(n) {
  return Math.sqrt(Math.pow(n[0], 2) + Math.pow(n[1], 2) + Math.pow(n[2], 2));
}
function wr(n, r) {
  const e = fS(n, r) / (Qh(n) * Qh(r));
  return Math.acos(Math.min(Math.max(e, -1), 1));
}
function qo(n) {
  const r = rt(n[1]), e = rt(n[0]);
  return [
    Math.cos(r) * Math.cos(e),
    Math.cos(r) * Math.sin(e),
    Math.sin(r)
  ];
}
function kr(n) {
  const [r, e, s] = n, u = oi(Math.asin(s));
  return [oi(Math.atan2(e, r)), u];
}
function dS(n, r, e) {
  const s = qo(n), u = qo(r), c = qo(e), [f, h, m] = c, [d, y, _] = gS(s, u), E = y * m - _ * h, S = _ * f - d * m, I = d * h - y * f, D = I * y - S * _, q = E * _ - I * d, G = S * d - E * y, M = 1 / Math.sqrt(Math.pow(D, 2) + Math.pow(q, 2) + Math.pow(G, 2)), H = [D * M, q * M, G * M], V = [-1 * D * M, -1 * q * M, -1 * G * M], X = wr(s, u), j = wr(s, H), $ = wr(u, H), x = wr(s, V), k = wr(u, V);
  let T;
  return j < x && j < k || $ < x && $ < k ? T = H : T = V, wr(s, T) > X || wr(u, T) > X ? on(kr(T), kr(s)) <= on(kr(T), kr(u)) ? [kr(s), !0, !1] : [kr(u), !1, !0] : [kr(T), !1, !1];
}
function pS(n, r) {
  if (!n) throw new Error("line is required");
  if (!r) throw new Error("splitter is required");
  var e = nc(n), s = nc(r);
  if (e !== "LineString") throw new Error("line must be LineString");
  if (s === "FeatureCollection")
    throw new Error("splitter cannot be a FeatureCollection");
  if (s === "GeometryCollection")
    throw new Error("splitter cannot be a GeometryCollection");
  var u = eS(r, { precision: 7 });
  switch (s) {
    case "Point":
      return wu(n, u);
    case "MultiPoint":
      return ef(n, u);
    case "LineString":
    case "MultiLineString":
    case "Polygon":
    case "MultiPolygon":
      return ef(
        n,
        ks(n, u, {
          ignoreSelfIntersections: !0
        })
      );
  }
}
function ef(n, r) {
  var e = [], s = bd();
  return ur(r, function(u) {
    if (e.forEach(function(h, m) {
      h.id = m;
    }), !e.length)
      e = wu(n, u).features, e.forEach(function(h) {
        h.bbox || (h.bbox = Qk(wn(h)));
      }), s.load(Ke(e));
    else {
      var c = s.search(u);
      if (c.features.length) {
        var f = Td(u, c);
        e = e.filter(function(h) {
          return h.id !== f.id;
        }), s.remove(f), Tn(wu(f, u), function(h) {
          e.push(h), s.insert(h);
        });
      }
    }
  }), Ke(e);
}
function wu(n, r) {
  var e = [], s = Pt(n)[0], u = Pt(n)[n.geometry.coordinates.length - 1];
  if (Yo(s, $e(r)) || Yo(u, $e(r)))
    return Ke([n]);
  var c = bd(), f = nS(n);
  c.load(f);
  var h = c.search(r);
  if (!h.features.length) return Ke([n]);
  var m = Td(r, h), d = [s], y = sm(
    f,
    function(_, E, S) {
      var I = Pt(E)[1], D = $e(r);
      return S === m.id ? (_.push(D), e.push(ls(_)), Yo(D, I) ? [D] : [D, I]) : (_.push(I), _);
    },
    d
  );
  return y.length > 1 && e.push(ls(y)), Ke(e);
}
function Td(n, r) {
  if (!r.features.length) throw new Error("lines must contain features");
  if (r.features.length === 1) return r.features[0];
  var e, s = 1 / 0;
  return Tn(r, function(u) {
    var c = hS(u, n), f = c.properties.dist;
    f < s && (e = u, s = f);
  }), e;
}
function Yo(n, r) {
  return n[0] === r[0] && n[1] === r[1];
}
var mS = pS;
class vS extends ki {
  constructor() {
    super(...arguments);
    R(this, "mode", "cut");
    R(this, "lineDrawer", new dl(
      this.gm,
      { snappingMarkers: "first", targetShape: "polygon" }
    ));
    R(this, "cutShapesAllowed", ["circle", "line", "rectangle", "polygon"]);
    R(this, "mapEventHandlers", {
      [`${pe}:draw`]: this.forwardLineDrawerEvent.bind(this),
      mousemove: this.onMouseMove.bind(this)
    });
  }
  onStartAction() {
    this.lineDrawer.startAction(), this.lineDrawer.on(
      "firstMarkerClick",
      this.cutPolygonFinished.bind(this)
    );
  }
  onEndAction() {
    this.lineDrawer.endAction();
  }
  onMouseMove(e) {
    return st(e) ? (this.lineDrawer.featureData || this.fireMarkerPointerUpdateEvent(), { next: !0 }) : { next: !0 };
  }
  cutPolygonFinished(e) {
    this.lineDrawer.endShape();
    const s = gl(e.geoJson), u = this.getBBoxFeaturesByPolygon(s);
    this.cutFeaturesByPolygon(u, s);
  }
  getBBoxFeaturesByPolygon(e) {
    const s = Ju(e), u = this.gm.mapAdapter.coordBoundsToScreenBounds(s);
    return this.gm.mapAdapter.queryFeaturesByScreenCoordinates({
      queryCoordinates: u,
      sourceNames: [ee.main]
    });
  }
  cutFeaturesByPolygon(e, s) {
    e.forEach((u) => {
      if (lh(u.getGeoJson(), s)) {
        this.gm.features.delete(u), this.fireFeatureRemovedEvent(u);
        return;
      }
      if (Ed(u.getGeoJson(), s) && this.cutShapesAllowed.includes(u.shape)) {
        if (u.shape === "line") {
          this.cutLineFeatureByPolygon(u, s);
          return;
        }
        this.cutPolygonFeatureByPolygon(u.id, s);
      }
    });
  }
  cutLineFeatureByPolygon(e, s) {
    const u = e.getGeoJson(), c = nx(this.gm.mapAdapter, s), f = mS(u, s);
    if (!c || f.features.length === 0)
      return;
    const h = [];
    if (f.features.filter((m) => !lh(m, c)).forEach((m) => {
      const d = this.createLineFeature(ug(m));
      d && h.push(d);
    }), this.gm.features.delete(e), !_d(h)) {
      ae.error("cutLineFeatureByPolygon: resultFeatures not found", f);
      return;
    }
    this.fireFeatureUpdatedEvent({
      sourceFeatures: [e],
      targetFeatures: h
    });
  }
  createLineFeature(e) {
    const s = {
      ...e,
      properties: {
        shape: "line"
      }
    };
    return this.gm.features.createFeature({
      shapeGeoJson: s,
      sourceName: ee.main
    });
  }
  cutPolygonFeatureByPolygon(e, s) {
    const u = this.gm.features.get(ee.main, e);
    if (!u) {
      ae.warn("cutPolygonFeatureByPolygon: featureData not found", e);
      return;
    }
    u.convertToPolygon();
    const c = u.getGeoJson(), f = this.getGeoJsonDifference(c, s);
    f && (u.updateGeoJsonGeometry(f.geometry), this.fireFeatureUpdatedEvent({
      sourceFeatures: [u],
      targetFeatures: [u]
    }));
  }
  getGeoJsonDifference(e, s) {
    const u = Ke([e, s]), c = Id(u);
    return c ? c.type === "Feature" ? c : (c.type === "FeatureCollection" && ae.error("getGeoJsonDifference: FeatureCollection detected (not supported)", c), null) : null;
  }
}
class yS extends ki {
  constructor() {
    super(...arguments);
    R(this, "mode", "delete");
    R(this, "mapEventHandlers", {
      click: this.onMouseClick.bind(this)
    });
  }
  onStartAction() {
    this.gm.markerPointer.enable({ invisibleMarker: !0 }), this.gm.markerPointer.pauseSnapping();
  }
  onEndAction() {
    this.gm.markerPointer.resumeSnapping(), this.gm.markerPointer.disable();
  }
  onMouseClick(e) {
    if (!st(e, { warning: !0 }))
      return { next: !1 };
    const s = this.gm.features.getFeatureByMouseEvent({ event: e, sourceNames: [ee.main] });
    return s && (this.gm.features.delete(s), this.fireFeatureRemovedEvent(s)), { next: !1 };
  }
}
class _S extends pl {
  constructor() {
    super(...arguments);
    R(this, "mode", "drag");
  }
  onStartAction() {
  }
  onEndAction() {
  }
  handleGmEdit(e) {
    return Si(e) ? e.action === "marker_move" && e.lngLatStart && e.lngLatEnd ? (this.previousLngLat || (this.previousLngLat = e.lngLatStart), this.moveFeature(e.featureData, e.lngLatEnd), { next: !1 }) : (e.action === "marker_captured" ? (this.isDragging = !0, e.featureData.changeSource({ sourceName: ee.temporary, atomic: !0 }), this.fireFeatureEditStartEvent({ feature: e.featureData })) : e.action === "marker_released" && (this.previousLngLat = null, this.isDragging = !1, e.featureData.changeSource({ sourceName: ee.main, atomic: !0 }), this.fireFeatureEditEndEvent({ feature: e.featureData })), { next: !0 }) : (ae.error("EditDrag.handleGmEdit: not an edit event", e), { next: !0 });
  }
}
function Ld(n, r, e = {}) {
  if (e.final === !0)
    return ES(n, r);
  const s = $e(n), u = $e(r), c = rt(s[0]), f = rt(u[0]), h = rt(s[1]), m = rt(u[1]), d = Math.sin(f - c) * Math.cos(m), y = Math.cos(h) * Math.sin(m) - Math.sin(h) * Math.cos(m) * Math.cos(f - c);
  return oi(Math.atan2(d, y));
}
function ES(n, r) {
  let e = Ld(r, n);
  return e = (e + 180) % 360, e;
}
var tf = Ld;
function xS(n, r, e = {}) {
  let s;
  return e.final ? s = nf($e(r), $e(n)) : s = nf($e(n), $e(r)), s > 180 ? -(360 - s) : s;
}
function nf(n, r) {
  const e = rt(n[1]), s = rt(r[1]);
  let u = rt(r[0] - n[0]);
  u > Math.PI && (u -= 2 * Math.PI), u < -Math.PI && (u += 2 * Math.PI);
  const c = Math.log(
    Math.tan(s / 2 + Math.PI / 4) / Math.tan(e / 2 + Math.PI / 4)
  ), f = Math.atan2(u, c);
  return (oi(f) + 360) % 360;
}
function wS(n, r, e = {}) {
  const s = $e(n), u = $e(r);
  u[0] += u[0] - s[0] > 180 ? -360 : s[0] - u[0] > 180 ? 360 : 0;
  const c = kS(s, u);
  return ff(c, "meters", e.units);
}
function kS(n, r, e) {
  e = e === void 0 ? nt : Number(e);
  const s = e, u = n[1] * Math.PI / 180, c = r[1] * Math.PI / 180, f = c - u;
  let h = Math.abs(r[0] - n[0]) * Math.PI / 180;
  h > Math.PI && (h -= 2 * Math.PI);
  const m = Math.log(
    Math.tan(c / 2 + Math.PI / 4) / Math.tan(u / 2 + Math.PI / 4)
  ), d = Math.abs(m) > 1e-11 ? f / m : Math.cos(u);
  return Math.sqrt(
    f * f + d * d * h * h
  ) * s;
}
function SS(n, r, e, s = {}) {
  const u = r < 0;
  let c = ff(
    Math.abs(r),
    s.units,
    "meters"
  );
  u && (c = -Math.abs(c));
  const f = $e(n), h = MS(
    f,
    c,
    e
  );
  return h[0] += h[0] - f[0] > 180 ? -360 : f[0] - h[0] > 180 ? 360 : 0, Un(h, s.properties);
}
function MS(n, r, e, s) {
  s = s === void 0 ? nt : Number(s);
  const u = r / s, c = n[0] * Math.PI / 180, f = rt(n[1]), h = rt(e), m = u * Math.cos(h);
  let d = f + m;
  Math.abs(d) > Math.PI / 2 && (d = d > 0 ? Math.PI - d : -Math.PI - d);
  const y = Math.log(
    Math.tan(d / 2 + Math.PI / 4) / Math.tan(f / 2 + Math.PI / 4)
  ), _ = Math.abs(y) > 1e-11 ? m / y : Math.cos(f), E = u * Math.sin(h) / _;
  return [
    ((c + E) * 180 / Math.PI + 540) % 360 - 180,
    d * 180 / Math.PI
  ];
}
function IS(n, r, e) {
  if (e = e || {}, !Tu(e)) throw new Error("options is invalid");
  const s = e.pivot, u = e.mutate;
  if (!n) throw new Error("geojson is required");
  if (r == null || isNaN(r))
    throw new Error("angle is required");
  if (r === 0) return n;
  const c = s ?? Kf(n);
  return (u === !1 || u === void 0) && (n = Va(n)), fr(n, function(f) {
    const m = xS(c, f) + r, d = wS(c, f), y = Pt(
      SS(c, d, m)
    );
    f[0] = y[0], f[1] = y[1];
  }), n;
}
var bS = IS;
class TS extends pl {
  constructor() {
    super(...arguments);
    R(this, "mode", "rotate");
    R(this, "convertFeaturesTypes", ["rectangle"]);
  }
  onStartAction() {
  }
  onEndAction() {
  }
  handleGmEdit(e) {
    var s;
    return Si(e) ? e.action === "marker_move" && e.lngLatStart && e.lngLatEnd ? (((s = e.markerData) == null ? void 0 : s.type) === "vertex" ? this.moveVertex(e) : this.moveSource(e.featureData, e.lngLatStart, e.lngLatEnd), { next: !1 }) : (e.action === "marker_captured" ? (e.featureData.changeSource({ sourceName: ee.temporary, atomic: !0 }), this.fireFeatureEditStartEvent({ feature: e.featureData })) : e.action === "marker_released" && (e.featureData.changeSource({ sourceName: ee.main, atomic: !0 }), this.fireFeatureEditEndEvent({ feature: e.featureData })), { next: !0 }) : (ae.error("EditChange.handleGmEdit: not an edit event", e), { next: !1 });
  }
  moveVertex(e) {
    this.rotateFeature(e.featureData, e);
  }
  rotateFeature(e, s) {
    const u = hn(e.getGeoJson()), c = Zf(Qf(u)), f = this.calculateRotationAngle(
      c,
      s.lngLatStart,
      s.lngLatEnd
    );
    u.geometry = bS(u, f, { pivot: c }).geometry, this.fireBeforeFeatureUpdate({
      features: [e],
      geoJsonFeatures: [u]
    }), this.updateFeatureGeoJson({ featureData: e, featureGeoJson: u }) && e.convertToPolygon();
  }
  calculateRotationAngle(e, s, u) {
    const c = tf(e, s);
    return (tf(e, u) - c + 360) % 360;
  }
}
const LS = {
  drag: _S,
  change: Mk,
  rotate: TS,
  scale: null,
  copy: null,
  cut: vS,
  split: null,
  union: null,
  difference: null,
  line_simplification: null,
  lasso: null,
  delete: yS
}, CS = (n, r) => {
  let e = null;
  try {
    n.forEach((s) => {
      if (r(s))
        throw e = s, new Error("found");
    });
  } catch {
  }
  return e;
};
var af;
class AS extends pr {
  constructor() {
    super(...arguments);
    R(this, "mode", "shape_markers");
    R(this, "pinEnabled", ((af = this.gm.options.controls.helper.pin) == null ? void 0 : af.active) || !1);
    R(this, "previousPosition", null);
    R(this, "activeMarker", null);
    R(this, "activeFeatureData", null);
    R(this, "sharedMarkers", []);
    R(this, "allowedShapes", ["circle", "line", "rectangle", "polygon"]);
    R(this, "edgeMarkersAllowed", !1);
    R(this, "edgeMarkerAllowedShapes", ["line", "rectangle", "polygon"]);
    R(this, "shapeMarkerAllowedModes", ["drag", "change", "cut", "split"]);
    R(this, "mapEventHandlers", {
      [`${pe}:draw`]: this.handleGmDraw.bind(this),
      [`${pe}:edit`]: this.handleGmEdit.bind(this),
      mousedown: this.onMouseDown.bind(this),
      touchstart: this.onMouseDown.bind(this),
      mouseup: this.onMouseUp.bind(this),
      touchend: this.onMouseUp.bind(this),
      mousemove: this.onMouseMove.bind(this),
      touchmove: this.onMouseMove.bind(this),
      contextmenu: this.onMouseRightButtonClick.bind(this)
    });
    R(this, "throttledMethods", Mi({
      sendMarkerMoveEvent: this.sendMarkerMoveEvent,
      sendMarkerRightClickEvent: this.sendMarkerRightClickEvent
    }, this, this.gm.options.settings.throttlingDelay));
    R(this, "debouncedMethods", J2({
      refreshMarkers: this.refreshMarkers
    }, this, this.gm.options.settings.throttlingDelay * 10));
  }
  onStartAction() {
    this.isShapeMarkerAllowed() && this.gm.markerPointer.enable({ invisibleMarker: !0 }), this.edgeMarkersAllowed = this.gm.getActiveEditModes().includes("change"), this.addMarkers();
  }
  onEndAction() {
    this.gm.markerPointer.disable(), this.removeMarkers();
  }
  setPin(e) {
    this.pinEnabled = e;
  }
  onMouseDown(e) {
    var c;
    const s = ["mousedown", "touchstart"];
    if (!st(e, { warning: !0 }) || !s.includes(e.type))
      return { next: !0 };
    if (e.type === "mousedown" && e.originalEvent.button !== 0)
      return { next: !0 };
    const u = this.getFeatureMarkerByMouseEvent(e);
    return this.activeMarker = u || null, this.activeFeatureData = (u == null ? void 0 : u.instance.parent) || null, this.activeMarker && this.activeFeatureData ? (this.previousPosition = $u(this.activeMarker.instance), this.gm.mapAdapter.setDragPan(!1), this.activeMarker.type === "edge" && this.sendMarkerEvent("edge_marker_click", this.activeFeatureData, this.activeMarker), this.pinEnabled && this.pinHelperInstance ? (this.sharedMarkers = this.pinHelperInstance.getSharedMarkers(this.activeMarker.position.coordinate), this.sharedMarkers.forEach(
      (f) => {
        var h;
        return (h = this.snappingHelper) == null ? void 0 : h.addExcludedFeature(f.featureData);
      }
    )) : (c = this.snappingHelper) == null || c.addExcludedFeature(this.activeFeatureData), this.sendMarkerEvent("marker_captured", this.activeFeatureData, this.activeMarker), { next: !1 }) : { next: !0 };
  }
  onMouseUp() {
    var s;
    if (!this.activeMarker)
      return { next: !0 };
    const e = {
      featureData: this.activeFeatureData,
      markerData: this.activeMarker
    };
    return this.activeMarker = null, this.activeFeatureData = null, this.sharedMarkers = [], (s = this.snappingHelper) == null || s.clearExcludedFeatures(), this.previousPosition = null, this.gm.mapAdapter.setDragPan(!0), e.featureData && e.markerData ? (this.sendMarkerEvent("marker_released", e.featureData, e.markerData), { next: !1 }) : (ae.debug("ShapeMarkersHelper.onMouseUp: no active marker or featureData", e), { next: !0 });
  }
  onMouseMove(e) {
    return !this.activeMarker || !st(e, { warning: !0 }) ? { next: !0 } : (this.throttledMethods.sendMarkerMoveEvent(e), { next: !1 });
  }
  onMouseRightButtonClick(e) {
    const s = this.getFeatureMarkerByMouseEvent(e);
    return s && s.instance.parent ? (this.throttledMethods.sendMarkerRightClickEvent(
      s.instance.parent,
      s
    ), { next: !1 }) : { next: !0 };
  }
  get pinHelperInstance() {
    return this.pinEnabled && Object.values(this.gm.actionInstances).find(K2) || null;
  }
  isShapeMarkerAllowed() {
    return x_(
      this.shapeMarkerAllowedModes,
      this.gm.getActiveEditModes()
    ).length > 0;
  }
  convertToVertexMarker(e) {
    if (e.type === "edge" && e.instance.parent) {
      const s = e.position, u = e.instance.parent;
      this.removeMarker(e);
      const c = this.createMarker({
        type: "vertex",
        positionData: s,
        parentFeature: u
      }), f = u.getGeoJson(), h = O_(f, s.coordinate);
      if (h) {
        const m = h.path.join("."), d = u.markers.get(m);
        return d && this.removeMarker(d), u.markers.set(m, c), c;
      }
    }
    return ae.error("ShapeMarkersHelper.convertToVertexMarker: invalid marker type", e), e;
  }
  getFeatureMarkerByMouseEvent(e) {
    var u;
    const s = this.gm.features.getFeatureByMouseEvent({
      event: e,
      sourceNames: [ee.main]
    });
    if ((u = s == null ? void 0 : s.parent) != null && u.markers) {
      const c = CS(
        s.parent.markers,
        (f) => f.instance === s
      );
      if ((c == null ? void 0 : c.type) !== "dom")
        return c;
    }
    return null;
  }
  addMarkers() {
    this.gm.features.forEach((e) => {
      if (!e || !this.allowedShapes.includes(e.shape))
        return;
      this.addCenterMarker(e);
      const s = this.getAllShapeSegments(e);
      s.forEach((u, c) => {
        if (this.isMarkerIndexAllowed(
          e.shape,
          c,
          s.length
        )) {
          const h = this.createOrUpdateVertexMarker(u.segment.start, e);
          if (e.markers.set(h.markerKey, h.markerData), e.shape === "line" && c === s.length - 1) {
            const m = this.createOrUpdateVertexMarker(
              u.segment.end,
              e
            );
            e.markers.set(m.markerKey, m.markerData);
          }
        }
        if (this.isEdgeMarkerAllowed(e)) {
          const h = this.createOrUpdateEdgeMarker(u, e);
          e.markers.set(h.markerKey, h.markerData);
        }
      });
    });
  }
  addCenterMarker(e) {
    if (e.shapeProperties.center) {
      const s = this.createMarker({
        type: "center",
        positionData: {
          path: [],
          coordinate: e.shapeProperties.center
        },
        parentFeature: e
      });
      e.markers.set("center", s);
    }
  }
  getAllShapeSegments(e) {
    const s = e.getGeoJson(), u = [];
    return Hu(s, (c, f) => {
      u.push({
        segment: c,
        middle: this.getSegmentMiddlePosition(c),
        edgeMarkerKey: this.getEdgeMarkerKey(f)
      });
    }), u;
  }
  isEdgeMarkerAllowed(e) {
    return this.edgeMarkersAllowed && this.edgeMarkerAllowedShapes.includes(e.shape);
  }
  isMarkerIndexAllowed(e, s, u) {
    const c = Math.floor(u / 4);
    return e === "circle" ? (s + c / 2) % c === 0 : !0;
  }
  getEdgeMarkerKey(e) {
    return `edge.${e}`;
  }
  getSegmentMiddlePosition(e) {
    const s = this.gm.mapAdapter.project(e.start.coordinate), u = this.gm.mapAdapter.project(e.end.coordinate), c = [
      (s[0] + u[0]) / 2,
      (s[1] + u[1]) / 2
    ], f = e.start.path.slice(0, e.start.path.length - 1).concat([-1]);
    return {
      coordinate: this.gm.mapAdapter.unproject(c),
      path: f
    };
  }
  removeMarkers() {
    this.gm.features.forEach((e, s) => {
      const u = this.gm.features.get(ee.main, s);
      u && (u.markers.forEach((c) => {
        c.type !== "dom" ? this.gm.features.delete(c.instance) : ae.error("Non a FeatureData marker", c);
      }), u.markers = /* @__PURE__ */ new Map());
    });
  }
  removeMarker(e) {
    if (e.type === "dom") {
      ae.error("Wrong marker type", e);
      return;
    }
    const s = e.instance.parent;
    if (!s) {
      ae.error("Missing parent feature data", e);
      return;
    }
    try {
      s.markers.forEach((u, c) => {
        if (u === e)
          throw this.gm.features.delete(u.instance), s.markers.delete(c), new Error("break");
      });
    } catch {
    }
  }
  createMarker({ type: e, segment: s, positionData: u, parentFeature: c }) {
    const f = u.coordinate, h = this.gm.features.createMarkerFeature({
      sourceName: c.sourceName,
      parentFeature: c,
      type: e,
      coordinate: f
    });
    if (!h)
      throw new Error(`Missine feature data for the "${e}" marker`);
    if (e === "edge" && s)
      return {
        type: e,
        instance: h,
        position: hn(u),
        segment: s
      };
    if (e === "vertex" || e === "center")
      return {
        type: e,
        instance: h,
        position: hn(u)
      };
    throw new Error(`Invalid marker type "${e}" with segment: ${s}`);
  }
  handleGmDraw(e) {
    return Zu(e) ? (e.action === "feature_created" && this.debouncedMethods.refreshMarkers(), { next: !0 }) : (ae.error("ShapeMarkersHelper.handleGmDraw: not a draw event", e), { next: !0 });
  }
  refreshMarkers() {
    this.removeMarkers(), this.addMarkers();
  }
  handleGmEdit(e) {
    return Si(e) ? (e.action === "feature_updated" && this.gm.features.withAtomicSourcesUpdate(() => {
      this.handleShapeUpdate(e);
    }), { next: !0 }) : (ae.error("ShapeMarkersHelper.handleGmEdit: not an edit event", e), { next: !0 });
  }
  handleShapeUpdate(e) {
    var f;
    const s = e.targetFeatures[0];
    if (!s) {
      ae.error("ShapeMarkersHelper.handleShapeUpdate: no featureData", e);
      return;
    }
    ((f = this.activeMarker) == null ? void 0 : f.type) === "edge" && (this.activeMarker = this.convertToVertexMarker(this.activeMarker));
    const u = this.getAllShapeSegments(s), c = new Set(s.markers.keys());
    u.forEach((h, m) => {
      if (this.isMarkerIndexAllowed(
        s.shape,
        m,
        u.length
      )) {
        const y = this.createOrUpdateVertexMarker(h.segment.start, s);
        if (c.delete(y.markerKey), s.shape === "line" && m === u.length - 1) {
          const _ = this.createOrUpdateVertexMarker(
            h.segment.end,
            s
          );
          c.delete(_.markerKey);
        }
      }
      if (this.isEdgeMarkerAllowed(s)) {
        const y = this.createOrUpdateEdgeMarker(h, s);
        c.delete(y.markerKey);
      }
    }), this.updateCenterMarkerPosition(s), c.delete("center"), c.forEach((h) => {
      const m = s.markers.get(h);
      m && m.type !== "dom" ? this.gm.features.delete(m.instance) : ae.error("Non a FeatureData marker"), s.markers.delete(h);
    });
  }
  createOrUpdateVertexMarker(e, s) {
    const u = e.path.join(".");
    let c = s.markers.get(u) || null;
    if (c && (c == null ? void 0 : c.type) !== "vertex")
      throw new Error(`Invalid marker type "${c == null ? void 0 : c.type}" for edge marker`);
    return c ? (Rc(c.position.coordinate, e.coordinate) || this.gm.features.updateMarkerFeaturePosition(c.instance, e.coordinate), c.position = e) : (c = this.createMarker({
      type: "vertex",
      positionData: e,
      parentFeature: s
    }), s.markers.set(u, c)), { markerKey: u, markerData: c };
  }
  createOrUpdateEdgeMarker(e, s) {
    let u = s.markers.get(e.edgeMarkerKey) || null;
    if (u && (u == null ? void 0 : u.type) !== "edge")
      throw new Error(`Invalid marker type "${u == null ? void 0 : u.type}" for edge marker`);
    return u ? (Rc(u.position.coordinate, e.middle.coordinate) || u.instance.updateGeoJsonGeometry({
      type: "Point",
      coordinates: e.middle.coordinate
    }), u.position = e.middle, u.segment = e.segment) : (u = this.createMarker({
      type: "edge",
      positionData: e.middle,
      segment: e.segment,
      parentFeature: s
    }), s.markers.set(e.edgeMarkerKey, u)), { markerKey: e.edgeMarkerKey, markerData: u };
  }
  updateCenterMarkerPosition(e) {
    const s = e.markers.get("center") || null;
    s && s.type !== "dom" && e.shapeProperties.center && (s.instance.updateGeoJsonGeometry({
      type: "Point",
      coordinates: e.shapeProperties.center
    }), s.position.coordinate = e.shapeProperties.center);
  }
  sendMarkerEvent(e, s, u) {
    const c = {
      level: "system",
      type: "edit",
      mode: "change",
      action: e,
      featureData: s,
      markerData: u
    };
    this.gm.events.fire(`${pe}:edit`, c);
  }
  sendMarkerRightClickEvent(e, s) {
    const u = {
      level: "system",
      type: "edit",
      mode: "change",
      action: "marker_right_click",
      featureData: e,
      markerData: s
    };
    this.gm.events.fire(`${pe}:edit`, u);
  }
  sendMarkerMoveEvent(e) {
    var u;
    const s = ((u = this.gm.markerPointer.marker) == null ? void 0 : u.getLngLat()) || e.lngLat.toArray();
    this.activeMarker && this.activeFeatureData && (this.pinEnabled ? this.sharedMarkers : [{
      markerData: this.activeMarker,
      featureData: this.activeFeatureData
    }]).forEach((f) => {
      if (this.previousPosition) {
        const h = {
          level: "system",
          type: "edit",
          mode: "drag",
          action: "marker_move",
          featureData: f.featureData,
          markerData: f.markerData,
          lngLatStart: this.previousPosition,
          lngLatEnd: s
        };
        this.gm.events.fire(`${pe}:edit`, h);
      }
    }), this.previousPosition = s;
  }
}
class NS extends pr {
  constructor() {
    super(...arguments);
    R(this, "mode", "snapping");
    R(this, "tolerance", 18);
    R(this, "excludedFeature", /* @__PURE__ */ new Set());
    R(this, "customSnappingLngLats", /* @__PURE__ */ new Map());
    R(this, "customSnappingFeatures", /* @__PURE__ */ new Set());
    R(this, "lineSnappingShapes", [
      "circle",
      "line",
      "rectangle",
      "polygon",
      "snap_guide"
    ]);
    R(this, "mapEventHandlers", {});
    R(this, "shapeSnappingHandlers", {
      marker: this.getPointsSnapping.bind(this),
      circle: this.getLineSnapping.bind(this),
      circle_marker: this.getPointsSnapping.bind(this),
      text_marker: this.getPointsSnapping.bind(this),
      line: this.getLineSnapping.bind(this),
      rectangle: this.getLineSnapping.bind(this),
      polygon: this.getLineSnapping.bind(this),
      snap_guide: this.getLineSnapping.bind(this)
    });
  }
  onStartAction() {
    this.gm.markerPointer.setSnapping(!0);
  }
  onEndAction() {
    this.gm.markerPointer.setSnapping(!1);
  }
  addExcludedFeature(e) {
    this.excludedFeature.add(e);
  }
  clearExcludedFeatures() {
    this.excludedFeature.clear();
  }
  addCustomSnappingFeature(e) {
    this.customSnappingFeatures.add(e);
  }
  removeCustomSnappingFeature(e) {
    this.customSnappingFeatures.delete(e);
  }
  clearCustomSnappingFeature() {
    this.customSnappingFeatures.clear();
  }
  setCustomSnappingCoordinates(e, s) {
    this.customSnappingLngLats.set(e, s);
  }
  clearCustomSnappingCoordinates(e) {
    this.customSnappingLngLats.delete(e);
  }
  getSnappedLngLat(e, s) {
    let u = this.getCustomLngLatsSnapping(s);
    if (u)
      return u;
    const c = this.getFeaturesInPointBounds(s).filter(
      (f) => !this.excludedFeature.has(f)
    );
    return u = this.getFeaturePointsSnapping(c, e, s), u || (u = this.getFeatureLinesSnapping(c, e, s), u) ? u : e;
  }
  getCustomLngLatsSnapping(e) {
    const s = {
      distance: 1 / 0,
      lngLat: null
    };
    return this.customSnappingLngLats.forEach((u) => {
      u.forEach((c) => {
        const f = this.gm.mapAdapter.project(c), h = Ks(e, f);
        h < this.tolerance && h < s.distance && (s.distance = h, s.lngLat = c);
      });
    }), s.lngLat;
  }
  getFeaturePointsSnapping(e, s, u) {
    let c = e.map((f) => ({
      shape: f.shape,
      ...this.getPointsSnapping(f, s, u)
    })).filter((f) => f.distance < this.tolerance);
    return c.length ? (c = Oc(c, ["distance"]), c[0].lngLat) : null;
  }
  getFeatureLinesSnapping(e, s, u) {
    let c = e.filter(
      (f) => this.lineSnappingShapes.includes(f.shape)
    ).map((f) => {
      const h = this.shapeSnappingHandlers[f.shape];
      return h ? {
        shape: f.shape,
        ...h(f, s, u)
      } : null;
    }).filter(
      (f) => f !== null && f.distance < this.tolerance
    );
    return c.length ? (c = Oc(c, ["distance"]), c[0].lngLat) : null;
  }
  getFeaturesInPointBounds(e) {
    const s = [
      [e[0] - this.tolerance, e[1] - this.tolerance],
      [e[0] + this.tolerance, e[1] + this.tolerance]
    ];
    return this.gm.features.getFeaturesByScreenBounds(
      { bounds: s, sourceNames: [ee.main, ee.temporary] }
    ).filter((u) => u.temporary ? this.customSnappingFeatures.has(u) : !0) || [];
  }
  getPointsSnapping(e, s, u) {
    const c = e.getGeoJson(), f = {
      distance: 1 / 0,
      coord: null
      // lngLat coords
    };
    return xs(c, (h) => {
      const m = this.gm.mapAdapter.project(h.coordinate), d = Ks(u, m);
      d < this.tolerance && d < f.distance && (f.distance = d, f.coord = h.coordinate);
    }, !0), {
      lngLat: f.coord ? f.coord : s,
      distance: f.distance
    };
  }
  getLineSnapping(e, s, u) {
    const c = e.getGeoJson();
    return this.getNearestLinePointData(c, s, u);
  }
  getNearestLinePointData(e, s, u) {
    const c = {
      lngLat: s,
      distance: 1 / 0
    }, f = this.gm.mapAdapter.getEuclideanNearestLngLat(
      e,
      s
    ), h = this.gm.mapAdapter.project(f);
    return c.distance = Ks(h, u), c.distance < this.tolerance && (c.lngLat = f), c;
  }
}
class OS extends pr {
  constructor() {
    super(...arguments);
    R(this, "mode", "zoom_to_features");
    R(this, "mapEventHandlers", {});
  }
  onStartAction() {
    this.fitMapToFeatures(), setTimeout(() => {
      this.gm.options.disableMode("helper", "zoom_to_features");
    });
  }
  onEndAction() {
  }
  fitMapToFeatures() {
    const e = this.gm.features.asGeoJsonFeatureCollection({
      sourceNames: [ee.main, ee.standby]
    }), s = gf(e), u = [
      [s[0], s[1]],
      [s[2], s[3]]
    ];
    try {
      this.gm.mapAdapter.fitBounds(u, { padding: 20 });
    } catch {
      ae.warn("Wrong bounds for zooming to features", u, e);
    }
  }
}
const PS = {
  shape_markers: AS,
  pin: null,
  snapping: NS,
  snap_guides: null,
  measurements: null,
  auto_trace: null,
  geofencing: null,
  zoom_to_features: OS,
  click_to_edit: null
};
class RS {
  constructor(r) {
    R(this, "gm");
    R(this, "marker", null);
    R(this, "tmpMarker", null);
    R(this, "snapping", !1);
    R(this, "oldSnapping");
    this.gm = r, this.initEventHandlers();
  }
  initEventHandlers() {
    this.throttledMethods = Mi({
      onMouseMove: this.onMouseMove
    }, this, this.gm.options.settings.throttlingDelay), this.mapEventHandlers = {
      mousemove: this.throttledMethods.onMouseMove.bind(this)
    };
  }
  get snappingHelper() {
    return this.gm.actionInstances.helper__snapping || null;
  }
  setSnapping(r) {
    if (r && !this.snappingHelper) {
      ae.error("MarkerPointer: snapping is not available");
      return;
    }
    this.snapping = r;
  }
  pauseSnapping() {
    this.oldSnapping !== void 0 && ae.error("MarkerPointer: snapping is already paused"), this.oldSnapping = this.snapping, this.setSnapping(!1);
  }
  resumeSnapping() {
    this.oldSnapping === void 0 ? (ae.error("MarkerPointer: resumeSnapping is called before pauseSnapping"), this.setSnapping(!0)) : (this.setSnapping(this.oldSnapping), this.oldSnapping = void 0);
  }
  enable({ lngLat: r, customMarker: e, invisibleMarker: s } = {
    lngLat: [0, 0],
    customMarker: void 0,
    invisibleMarker: !1
  }) {
    if (!H2()) {
      if (e && s)
        throw new Error("MarkerPointer: customMarker and invisibleMarker can't be used together");
      if (this.marker)
        throw new Error("MarkerPointer: marker is already enabled");
      this.gm.events.bus.attachEvents(this.mapEventHandlers), s ? this.marker = this.createInvisibleMarker(r || [0, 0]) : this.marker = e || this.createMarker(r || [0, 0]), this.gm.getActiveDrawModes().length && this.gm.mapAdapter.setCursor("crosshair");
    }
  }
  disable() {
    this.marker && (this.gm.events.bus.detachEvents(this.mapEventHandlers), this.marker.remove(), this.marker = null), this.gm.mapAdapter.setCursor("");
  }
  createMarker(r = [0, 0]) {
    return this.gm.mapAdapter.createDomMarker({
      anchor: "center",
      element: md("dom", { pointerEvents: "none" })
    }, r);
  }
  createInvisibleMarker(r = [0, 0]) {
    const e = document.createElement("div");
    return e.style.width = "0px", e.style.height = "0px", this.gm.mapAdapter.createDomMarker({
      anchor: "center",
      element: e
    }, r);
  }
  onMouseMove(r) {
    if (st(r, { warning: !0 }) && this.marker)
      if (this.snapping && this.snappingHelper) {
        const e = [r.point.x, r.point.y], s = this.snappingHelper.getSnappedLngLat(r.lngLat.toArray(), e);
        this.marker.setLngLat(s);
      } else
        this.marker.setLngLat(r.lngLat.toArray());
    return { next: !0 };
  }
  syncTmpMarker(r) {
    this.tmpMarker || (this.tmpMarker = this.createMarker(r)), this.tmpMarker.setLngLat(r);
  }
}
const tM = {
  type: "Feature",
  properties: {
    shape: "polygon"
  },
  geometry: {
    type: "MultiPolygon",
    coordinates: [
      [
        [
          [
            4,
            51.2
          ],
          [
            5.4,
            52.4
          ],
          [
            6.8,
            51.2
          ],
          [
            4,
            51.2
          ]
        ]
      ]
    ]
  }
}, nM = {
  type: "Feature",
  properties: {
    shape: "rectangle"
  },
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [
          -0.47,
          51.67
        ],
        [
          1.43,
          51.67
        ],
        [
          1.43,
          53.32
        ],
        [
          -0.47,
          53.32
        ],
        [
          -0.47,
          51.67
        ]
      ]
    ]
  }
};
function DS(n, r = {}) {
  const e = [];
  if (gr(n, (u) => {
    e.push(u.coordinates);
  }), e.length < 2)
    throw new Error("Must have at least 2 geometries");
  const s = jk(e[0], ...e.slice(1));
  return s.length === 0 ? null : s.length === 1 ? or(s[0], r.properties) : Mu(s, r.properties);
}
var FS = DS;
class rM extends ki {
  constructor() {
    super(...arguments);
    R(this, "features", []);
    R(this, "featureData", null);
    R(this, "mapEventHandlers", {
      click: this.onMouseClick.bind(this)
    });
  }
  onStartAction() {
  }
  onEndAction() {
    this.features.forEach((e) => {
      e.changeSource({ sourceName: ee.main, atomic: !0 });
    }), this.features = [];
  }
  onMouseClick(e) {
    if (this.unselectFeature(e))
      return { next: !0 };
    const u = this.getAllowedFeatureByMouseEvent({ event: e, sourceNames: [ee.main] });
    return u && this.isFeatureAllowedToGroup(u) && (u.changeSource({ sourceName: ee.temporary, atomic: !0 }), this.features.push(u)), this.features.length > 1 ? (this.groupFeatures(), { next: !0 }) : { next: !0 };
  }
  unselectFeature(e) {
    const s = this.getAllowedFeatureByMouseEvent({
      event: e,
      sourceNames: [ee.temporary]
    });
    if (s) {
      const u = this.features.findIndex(
        (c) => c === s
      );
      return u > -1 && this.features.splice(u, 1), s.changeSource({ sourceName: ee.main, atomic: !0 }), !0;
    }
    return !1;
  }
  getAllowedFeatureByMouseEvent({ event: e, sourceNames: s }) {
    const u = this.gm.features.getFeatureByMouseEvent({ event: e, sourceNames: s });
    return u && this.allowedShapeTypes.includes(u.shape) ? u : null;
  }
  isFeatureAllowedToGroup(e) {
    if (!this.allowedShapeTypes.includes(e.shape))
      return !1;
    if (this.features.length === 0)
      return !0;
    const s = e.getGeoJson();
    return this.features.every(
      (u) => Ed(u.getGeoJson(), s)
    );
  }
  groupFeatures() {
    if (!this.features.length) {
      ae.error("BaseGroupEdit.groupFeatures: no features to group");
      return;
    }
    const e = {
      type: "FeatureCollection",
      features: this.features.map((u) => {
        const c = u.getGeoJson();
        return ["Polygon", "MultiPolygon"].includes(c.geometry.type) ? c : null;
      }).filter((u) => !!u)
    };
    let s = null;
    if (this.mode === "union" ? s = FS(e) : this.mode === "difference" && (s = Id(e)), s) {
      const u = this.gm.features.createFeature({
        shapeGeoJson: {
          ...s,
          properties: {
            ...s.properties,
            shape: "polygon"
          }
        },
        sourceName: ee.main
      });
      this.features.forEach((c) => {
        this.gm.features.delete(c);
      }), u && _d(this.features) && this.fireFeatureUpdatedEvent({
        sourceFeatures: this.features,
        targetFeatures: [u]
      }), this.features = [];
    }
  }
}
class GS {
  constructor(r, e = {}) {
    R(this, "mapAdapterInstance", null);
    R(this, "globalLngLatBounds", this.getGlobalLngLatBounds());
    R(this, "features");
    R(this, "loaded", !1);
    R(this, "options");
    R(this, "events");
    R(this, "control");
    R(this, "actionInstances", {});
    R(this, "markerPointer");
    const s = Object.assign(r, { gm: this });
    this.options = this.initCoreOptions(e), this.events = this.initCoreEvents(), this.features = this.initCoreFeatures(), this.control = this.initCoreControls(), this.markerPointer = this.initMarkerPointer(), ax(r) && (this.isMapInstanceLoaded(r) ? this.init(s).then() : r.once("load", async () => {
      await this.init(s);
    }));
  }
  initCoreOptions(r = {}) {
    return new q2(this, r);
  }
  initCoreEvents() {
    return new A2(this);
  }
  initCoreFeatures() {
    return new ox(this);
  }
  initCoreControls() {
    return new y2(this);
  }
  initMarkerPointer() {
    return new RS(this);
  }
  get drawClassMap() {
    return kk;
  }
  get editClassMap() {
    return LS;
  }
  get helperClassMap() {
    return PS;
  }
  get mapAdapter() {
    if (this.mapAdapterInstance)
      return this.mapAdapterInstance;
    throw ae.trace("Map adapter is not initialized"), new Error("Map adapter is not initialized");
  }
  addControls(r = void 0) {
    return new Promise((e) => {
      (async () => {
        r ? this.control.createControls(r) : this.mapAdapter.addControl(this.control), await this.onMapLoad(), e();
      })().then();
    });
  }
  isMapInstanceLoaded(r) {
    return "_fullyLoaded" in r && r._fullyLoaded;
  }
  async init(r) {
    this.mapAdapterInstance = await U2(this, r), this.features.init(), await this.addControls();
  }
  destroy() {
    this.removeControls(), this.events.bus.detachAllEvents(), "gm" in this.mapAdapter.mapInstance && delete this.mapAdapter.mapInstance.gm;
  }
  removeControls() {
    this.disableAllModes(), this.mapAdapter.removeControl(this.control);
  }
  async onMapLoad() {
    this.loaded || (await this.mapAdapter.loadImage({
      id: "default-marker",
      image: of
    }), this.events.fire(`${pe}:control`, {
      level: "system",
      type: "control",
      action: "loaded"
    }), this.loaded = !0);
  }
  disableAllModes() {
    ft(this.actionInstances).forEach((r) => {
      const [e, s] = r.split("__");
      k2(e) && b2(s) && this.options.disableMode(e, s);
    });
  }
  getActiveDrawModes() {
    return ft(this.actionInstances).map((r) => {
      const e = this.actionInstances[r];
      return e instanceof Wn ? e.mode : null;
    }).filter((r) => r !== null);
  }
  getActiveEditModes() {
    return ft(this.actionInstances).map((r) => {
      const e = this.actionInstances[r];
      return e instanceof ki ? e.mode : null;
    }).filter((r) => r !== null);
  }
  getActiveHelperModes() {
    return ft(this.actionInstances).map((r) => {
      const e = this.actionInstances[r];
      return e instanceof pr ? e.mode : null;
    }).filter((r) => r !== null);
  }
  getGlobalLngLatBounds() {
    return [
      [-179.99999, -85.051129],
      [179.99999, 85.051129]
    ];
  }
  createDrawInstance(r) {
    return this.drawClassMap[r] ? new this.drawClassMap[r](this) : (ae.error(`Draw "${r}" is not available`), null);
  }
  createEditInstance(r) {
    return this.editClassMap[r] ? new this.editClassMap[r](this) : (ae.error(`Edit "${r}" is not available`), null);
  }
  createHelperInstance(r) {
    return this.helperClassMap[r] ? new this.helperClassMap[r](this) : (ae.error(`Helper "${r}" is not available`), null);
  }
  setGlobalEventsListener(r = null) {
    this.events.bus.forwarder.globalEventsListener = r;
  }
  enableMode(r, e) {
    this.options.enableMode(r, e);
  }
  disableMode(r, e) {
    this.options.disableMode(r, e);
  }
  toggleMode(r, e) {
    this.options.toggleMode(r, e);
  }
  isModeEnabled(r, e) {
    return this.options.isModeEnabled(r, e);
  }
  // helper methods for compatibility with the old API
  // draw (draw:*)
  enableDraw(r) {
    this.options.enableMode("draw", r);
  }
  disableDraw() {
    this.getActiveDrawModes().forEach(
      (r) => this.options.disableMode("draw", r)
    );
  }
  toggleDraw(r) {
    this.options.toggleMode("draw", r);
  }
  drawEnabled(r) {
    return this.options.isModeEnabled("draw", r);
  }
  // drag(edit:drag)
  enableGlobalDragMode() {
    this.options.enableMode("edit", "drag");
  }
  disableGlobalDragMode() {
    this.options.disableMode("edit", "drag");
  }
  toggleGlobalDragMode() {
    this.options.toggleMode("edit", "drag");
  }
  globalDragModeEnabled() {
    return this.options.isModeEnabled("edit", "drag");
  }
  // edit (edit:change)
  enableGlobalEditMode() {
    this.options.enableMode("edit", "change");
  }
  disableGlobalEditMode() {
    this.options.disableMode("edit", "change");
  }
  toggleGlobalEditMode() {
    this.options.toggleMode("edit", "change");
  }
  globalEditModeEnabled() {
    return this.options.isModeEnabled("edit", "change");
  }
  // rotate (edit:rotate)
  enableGlobalRotateMode() {
    this.options.enableMode("edit", "rotate");
  }
  disableGlobalRotateMode() {
    this.options.disableMode("edit", "rotate");
  }
  toggleGlobalRotateMode() {
    this.options.toggleMode("edit", "rotate");
  }
  globalRotateModeEnabled() {
    return this.options.isModeEnabled("edit", "rotate");
  }
  // cut (edit:cut)
  enableGlobalCutMode() {
    this.options.enableMode("edit", "cut");
  }
  disableGlobalCutMode() {
    this.options.disableMode("edit", "cut");
  }
  toggleGlobalCutMode() {
    this.options.toggleMode("edit", "cut");
  }
  globalCutModeEnabled() {
    return this.options.isModeEnabled("edit", "cut");
  }
  // remove (edit:delete)
  enableGlobalRemovalMode() {
    this.options.enableMode("edit", "delete");
  }
  disableGlobalRemovalMode() {
    this.options.disableMode("edit", "delete");
  }
  toggleGlobalRemovalMode() {
    this.options.toggleMode("edit", "delete");
  }
  globalRemovalModeEnabled() {
    return this.options.isModeEnabled("edit", "delete");
  }
}
const iM = async (n, r) => {
  const s = new GS(n, r);
  return await Promise.race([
    new Promise((u) => {
      s.mapAdapter.once(`${pe}:loaded`, u);
    }),
    new Promise((u, c) => {
      setTimeout(() => c(new Error(`Timeout ${6e4 / 1e3} seconds: can't init geoman`)), 6e4);
    })
  ]), s;
};
export {
  Wu as BaseAction,
  Su as BaseDomMarker,
  pl as BaseDrag,
  Wn as BaseDraw,
  ki as BaseEdit,
  rM as BaseGroupEdit,
  pr as BaseHelper,
  O2 as BaseLayer,
  N2 as BaseMapAdapter,
  R2 as BasePopup,
  J_ as BaseSource,
  br as FEATURE_ID_PROPERTY,
  da as FeatureData,
  GS as Geoman,
  q2 as GmOptions,
  dl as LineDrawer,
  RS as MarkerPointer,
  ee as SOURCES,
  AS as ShapeMarkersHelper,
  qS as boundsContains,
  P_ as boundsToBBox,
  YS as calculatePerimeter,
  Mt as controlIcons,
  HS as convertToLineStringFeatureCollection,
  Mi as convertToThrottled,
  iM as createGeomanInstance,
  nM as customShapeRectangle,
  tM as customShapeTriangle,
  ux as defaultLayerStyles,
  kk as drawClassMap,
  ng as drawModes,
  xs as eachCoordinateWithPath,
  Hu as eachSegmentWithPath,
  LS as editClassMap,
  gd as editModes,
  Z_ as extraDrawModes,
  O_ as findCoordinateWithPath,
  eM as formatArea,
  QS as formatDistance,
  Zf as geoJsonPointToLngLat,
  Ks as getEuclideanDistance,
  F_ as getEuclideanSegmentNearestPoint,
  Eo as getGeoJsonCoordinatesCount,
  $f as getGeoJsonFirstPoint,
  Gc as getLngLatDiff,
  pe as gmPrefix,
  ax as hasMapOnceMethod,
  PS as helperClassMap,
  dd as helperModes,
  Ir as includesWithType,
  k2 as isActionType,
  KS as isBaseMapEventName,
  S2 as isDrawModeName,
  M2 as isEditModeName,
  Rc as isEqualPosition,
  lh as isGeoJsonFeatureInPolygon,
  eg as isGmControlEvent,
  Zu as isGmDrawEvent,
  WS as isGmDrawFreehandDrawerEvent,
  tg as isGmDrawLineDrawerEvent,
  XS as isGmDrawShapeEvent,
  Si as isGmEditEvent,
  jt as isGmEvent,
  JS as isGmFeatureBeforeCreateEvent,
  VS as isGmFeatureBeforeUpdateEvent,
  Ja as isGmHelperEvent,
  Xu as isGmModeEvent,
  I2 as isHelperModeName,
  st as isMapPointerEvent,
  b2 as isModeName,
  Yu as isMultiPolygonFeature,
  _d as isNonEmptyArray,
  $S as isPointerEventName,
  qu as isPolygonFeature,
  q_ as lngLatToGeoJsonPoint,
  z2 as mergeByTypeCustomizer,
  jS as moveFeatureData,
  tx as moveGeoJson,
  as as shapeNames,
  Sk as toMod,
  zS as twoCoordsToLineString,
  ft as typedKeys
};
//# sourceMappingURL=maplibre-geoman.es.js.map

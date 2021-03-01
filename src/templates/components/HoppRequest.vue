<template>
  <section class="hopp-request">
    <div>
      <label :for="`hopp-request__select-${_uid}`">Request code sample</label>
      <select
        :id="`hopp-request__select-${_uid}`"
        v-model="selectedRequestType"
      >
        <option>JavaScript XHR</option>
        <option>Fetch</option>
        <option>cURL</option>
      </select>
    </div>
    <div
      class="hopp-request__sample"
      :class="{
        'language-bash': selectedRequestType === 'cURL',
        'language-javascript':
          selectedRequestType === 'Fetch' ||
          selectedRequestType === 'JavaScript XHR'
      }"
    >
      <pre><code>{{ requestExample }}</code></pre>
    </div>
    <button
      :class="{ 'hopp-request__fetching': api.fetching }"
      @click.prevent="send(`${url}${path}`, method)"
    >
      <template v-if="api.fetching">...</template>
      <template v-else>{{ btnText }}</template>
    </button>
    <span :class="{ error: api.error }">{{ api.message }}</span>
    <div v-if="api.loaded" class="hopp-request__response">
      <div class="hopp-request__api-message">
        <h4>Response</h4>
        <div class="language-json" v-if="!api.fetching">
          <pre
            class="hopp-request__language-json"
          ><code>{{ api.response }}</code></pre>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "HoppRequest",
  props: {
    url: {
      type: String,
      required: true
    },
    path: {
      type: String,
      default: ""
    },
    method: {
      type: String,
      default: "GET"
    }
  },
  data() {
    return {
      btnText: "Test request",
      requestType: "cURL",
      requestExample: "",
      api: {
        loaded: false,
        fetching: false,
        response: {},
        message: "",
        error: false
      }
    };
  },
  computed: {
    selectedRequestType: {
      get() {
        return this.requestType;
      },
      set(newRequestString) {
        this.requestType = newRequestString;
      }
    }
  },
  watch: {
    selectedRequestType(reqType) {
      this.requestExample = this.getRequestExample(
        reqType,
        this.method,
        `${this.url}${this.path}`
      );
    }
  },
  created() {
    this.requestExample = this.getRequestExample(
      this.requestType,
      this.method,
      `${this.url}${this.path}`
    );
  },
  methods: {
    getRequestExample(reqType, method, reqUrl) {
      if (method === "GET") {
        switch (reqType) {
          case "Fetch":
            return `fetch('${reqUrl}', {
  method: 'GET',
  credentials: 'same-origin'
  }).then(function(response) {
    response.status
    response.statusText
    response.headers
    response.url
    return response.text()
  }).catch(function(error) {
    error.message
})`;
          case "JavaScript XHR":
            return `const xhr = new XMLHttpRequest()
xhr.open('GET', '${reqUrl}', true, null, null)
xhr.send()`;
          default:
            return `cURL -X GET ${reqUrl}`;
            break; // default is cURL
        }
      } else
        throw new Error(
          `invalid params reqType:${reqType} or method: ${method} or reqUrl: ${reqUrl}`
        );
    },
    send(fullUrl, method) {
      this.api.fetching = true;
      this.api.message = "";
      const oReq = new XMLHttpRequest();
      oReq.addEventListener("load", ({ target }) => {
        this.api.response = JSON.parse(target.response, null, 2);
        this.api.fetching = false;
        this.api.loaded = true;
        this.btnText = "Test again";
      });
      oReq.addEventListener("error", ({ target }) => {
        this.api.response = target.response;
        this.api.fetching = false;
        this.api.message = "Error! The request failed";
      });
      oReq.addEventListener("abort", () => {
        this.api.fetching = false;
        this.api.message = "Error! The request was cancelled";
      });
      oReq.open(method, fullUrl, true, null, null);
      oReq.send();
    }
  }
};
</script>

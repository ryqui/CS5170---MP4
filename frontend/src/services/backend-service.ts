/**
 * fetch wrapper, that acts as an HTTP Service for POST and GET requests
 * @author Khoa Nguyen
 * @author Ryan Quinn
 */
class HttpService {
    private readonly baseURL: string;

    /**
     * Create a service object, providing the endpoint. The port and IP stays static for now.
     * @param endpoint the target route to post to
     */
    constructor(endpoint: string) {
        this.baseURL = "http://127.0.0.1:8080" + endpoint;
    }

    /**
     * Make GET request
     */
    get() {
        return fetch(this.baseURL, {method: "GET"})
    }

    /**
     * Make POST request, accept data to be stored in body before getting sent
     * @param data data to be wrapped in body
     */
    post(data: any) {
        return fetch(this.baseURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ params: [data] })
        })
    }
}

/**
 * Endpoint: /process
 * Send data to OpenAI API to process
 * @param req Request from client. Should contain:
 *      - 'text': text to process
 *      - 'context': instruct OpenAPI about what potential avoidance and dangerous content
 *      - 'vocabLevel': level of vocabulary that we expect from OpenAI API response
 *      - 'type': type of processing that we want to do
 * @return string response from OpenAI API
 */
const createProcessResponseService = () => {
    return new HttpService("/process");
}

export { createProcessResponseService };

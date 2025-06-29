package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-contrib/cors"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

type ReqBody struct {
	Prompt string `json:"prompt"`
}

type CohereRequest struct {
	Model     string `json:"model"`
	Prompt    string `json:"prompt"`
	MaxTokens int    `json:"max_tokens"`
}

type CohereResponse struct {
	Text string `json:"text"`
}

func callCohere(prompt, apikey string) (string, error) {

	cohereReq := CohereRequest{
		Model:     "command",
		Prompt:    prompt,
		MaxTokens: 100,
	}

	jsonData, _ := json.Marshal(cohereReq)

	req, err := http.NewRequest("POST", "https://api.cohere.ai/generate", bytes.NewBuffer(jsonData))
	if err != nil {
		return "", err
	}

	req.Header.Set("Authorization", "Bearer "+apikey)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{
		Timeout: time.Second * 10,
	}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	body, _ := ioutil.ReadAll(resp.Body)
	fmt.Println("Cohere raw response:", string(body)) // Debug print

	var cohereResp CohereResponse
	if err := json.Unmarshal(body, &cohereResp); err != nil {
		return "", err
	}

	if len(cohereResp.Text) > 0 {
		return cohereResp.Text, nil
	}

	return "", fmt.Errorf("no response from cohere")
}

func main() {

	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .ENV file")
	}

	apiKey := os.Getenv("COHERE_API_KEY")

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"https://ai-chatbot-three-psi-95.vercel.app"}, // next js front end server
		AllowMethods:     []string{"POST", "GET", "OPTIONS"},                      // allowed methods
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},     //allowed headers
		AllowCredentials: true,
	}))

	r.POST("/generate", func(c *gin.Context) {
		var req ReqBody

		if err := c.BindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
			return
		}

		generated, err := callCohere(req.Prompt, apiKey)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "failed to generate"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"generated": generated})

	})

	r.Run(":8080")
}

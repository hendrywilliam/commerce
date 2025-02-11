package utils

import (
	"regexp"
	"strings"
)

var nonAlphaNum = regexp.MustCompile(`[^A-Za-z0-9 ]`)
var spaces = regexp.MustCompile(`\s+`)

func Slugify(value string) string {
	alphaNum := nonAlphaNum.ReplaceAllString(value, "")
	slug := spaces.ReplaceAllString(strings.TrimSpace(strings.ToLower(alphaNum)), "-")
	return slug
}

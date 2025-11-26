import { GoogleGenAI, Type } from "@google/genai";
import type { FormData, GenerationResult } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    luckyNumbers: {
      type: Type.ARRAY,
      description: "Uma lista de 6 números da sorte únicos entre 1 e 60.",
      items: {
        type: Type.NUMBER
      }
    },
    explanation: {
       type: Type.STRING,
       description: "Uma citação inspiradora sobre sorte, sucesso ou riqueza, em português, de um livro de um autor bilionário ou milionário famoso, seguida pelo nome do autor. Exemplo: 'A persistência é para o caráter do homem o que o carbono é para o aço. - Napoleon Hill'"
    }
  },
  required: ['luckyNumbers', 'explanation']
};

export async function generateLuckyNumbers(formData: FormData, choseToDonate: boolean): Promise<GenerationResult> {
  const prompt = `
    Você é um oráculo cósmico, um especialista em numerologia e astrologia focado em jogos de loteria, especificamente a MegaSena do Brasil. Sua missão é traduzir as energias do universo e os dados de uma pessoa em 6 números da sorte únicos, entre 1 e 60.

    Sua análise para gerar os números deve ser mística e criativa, sutilmente incorporando a sabedoria dos padrões universais do acaso. Pense nisso como decodificar as marés do destino: equilibre números com diferentes frequências vibracionais (alguns que aparecem com frequência, outros mais raros), garantindo uma combinação harmonicamente aleatória e poderosa. A aleatoriedade é uma expressão da vastidão do cosmos, e sua seleção deve refletir isso.

    Após gerar os 6 números, sua segunda tarefa é fornecer uma poderosa mensagem de sorte. Esta mensagem deve ser uma citação real e inspiradora sobre sucesso, mentalidade ou riqueza, extraída de um livro escrito por um bilionário ou milionário mundialmente famoso (ex: Napoleon Hill, T. Harv Eker, Robert Kiyosaki, etc.). A citação deve ser em português e deve ser seguida pelo nome do autor.

    Dados do Apostador para sua canalização:
    - Nome: ${formData.fullName}
    - Data de Nascimento: ${formData.dob}
    - Idade: ${formData.age}
    - Altura (cm): ${formData.height}
    - Signo: ${formData.zodiacSign}
    - Cor Favorita: ${formData.favoriteColor}
    - Sente que precisa perdoar alguém?: ${formData.needsToForgive}
    - Sente que precisa ser perdoado?: ${formData.needsToBeForgiven}
    - Data do Sorteio: ${formData.drawDate}
    - Intenção de Doação: ${choseToDonate ? 'Sim' : 'Não'}

    Fatores de Energia a considerar para a geração dos NÚMEROS:
    - A intenção de doação ('Sim') é um poderoso catalisador kármico. Use-a para atrair números de prosperidade.
    - A Cor Favorita dita a vibração energética.
    - A necessidade de perdoar ou ser perdoado abre portais kármicos para números de libertação e novos começos.
    - A numerologia da data do sorteio alinha a previsão com o momento cósmico exato do evento.
    
    Retorne os 6 números e a citação inspiradora no formato JSON especificado.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 1, // Max creativity
        topP: 0.95,
      }
    });
    
    const text = response.text.trim();
    const parsedJson = JSON.parse(text);
    
    if (!parsedJson.luckyNumbers || !parsedJson.explanation || parsedJson.luckyNumbers.length !== 6) {
        throw new Error("Resposta da IA em formato inválido.");
    }

    return {
        luckyNumbers: parsedJson.luckyNumbers.sort((a: number, b: number) => a - b),
        explanation: parsedJson.explanation
    };

  } catch (error) {
    console.error("Erro na chamada da API Gemini:", error);
    throw new Error("Não foi possível gerar os números da sorte.");
  }
}